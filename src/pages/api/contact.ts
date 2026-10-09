// POST /api/contact/ — stores an offer/contact request in D1 and, when the
// EMAIL binding is configured, notifies ALBA IT by e-mail.
//
// Works with fetch (JSON in/out) and with a plain HTML form post
// (form-encoded in, 303 redirect out), so the form also works without JS.
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { validateLead, type Lead } from '@/lib/lead';

export const prerender = false;

const RATE_LIMIT_PER_HOUR = 5;

interface SendEmailBinding {
  send(message: { from: string; to: string; subject: string; text: string; html?: string; replyTo?: string }): Promise<unknown>;
}

const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
}

function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return true; // some privacy modes strip it; other checks still apply
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

function emailBody(lead: Lead, id: string, page: string | null) {
  const lines = [
    `Solicitare nouă de pe albait.ro (${id})`,
    '',
    `Nume: ${lead.name}`,
    lead.company ? `Firmă: ${lead.company}` : null,
    lead.phone ? `Telefon: ${lead.phone}` : null,
    lead.email ? `E-mail: ${lead.email}` : null,
    `Interes: ${lead.interest}`,
    page ? `Pagina: ${page}` : null,
    '',
    lead.message ?? '(fără mesaj)',
  ];
  return lines.filter((l) => l !== null).join('\n');
}

export const POST: APIRoute = async ({ request }) => {
  const isForm = (request.headers.get('content-type') ?? '').includes('application/x-www-form-urlencoded');
  const fail = (status: number, body: object) =>
    isForm ? Response.redirect(new URL('/contact/?trimis=eroare#oferta', request.url), 303) : json(body, status);

  if (!sameOrigin(request)) return fail(403, { ok: false, error: 'origin' });

  let input: Record<string, unknown>;
  try {
    input = isForm ? Object.fromEntries((await request.formData()).entries()) : await request.json();
  } catch {
    return fail(400, { ok: false, error: 'bad_request' });
  }

  const result = validateLead(input);
  if (!result.ok) {
    // Bots get a generic success so they don't learn how to adapt; nothing is stored.
    if ('spam' in result) return isForm ? Response.redirect(new URL('/multumim/', request.url), 303) : json({ ok: true });
    return fail(422, { ok: false, errors: result.errors });
  }

  const { lead } = result;
  const ip = request.headers.get('cf-connecting-ip') ?? '';
  const day = new Date().toISOString().slice(0, 10);
  // Daily-salted hash: enough to rate-limit, not enough to identify anyone.
  const ipHash = ip ? (await sha256(`${day}:${ip}`)).slice(0, 32) : null;
  const page = typeof input.page === 'string' ? input.page.slice(0, 200) : null;

  try {
    if (ipHash) {
      const since = new Date(Date.now() - 3600_000).toISOString();
      const row = await env.DB.prepare('SELECT COUNT(*) AS n FROM leads WHERE ip_hash = ? AND created_at > ?')
        .bind(ipHash, since)
        .first<{ n: number }>();
      if ((row?.n ?? 0) >= RATE_LIMIT_PER_HOUR) {
        return fail(429, { ok: false, error: 'rate_limited' });
      }
    }

    const id = crypto.randomUUID();
    await env.DB.prepare(
      `INSERT INTO leads (id, name, company, phone, email, interest, message, page, consent_at, ip_hash, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        id,
        lead.name,
        lead.company,
        lead.phone,
        lead.email,
        lead.interest,
        lead.message,
        page,
        new Date().toISOString(),
        ipHash,
        (request.headers.get('user-agent') ?? '').slice(0, 300),
      )
      .run();

    // Optional e-mail notification. The binding only exists once albait.ro is
    // onboarded to Cloudflare Email Service (see docs/deployment.md).
    const mailer = (env as unknown as { EMAIL?: SendEmailBinding }).EMAIL;
    if (mailer && env.LEAD_NOTIFY_TO && env.LEAD_NOTIFY_FROM) {
      try {
        await mailer.send({
          from: env.LEAD_NOTIFY_FROM,
          to: env.LEAD_NOTIFY_TO,
          replyTo: lead.email ?? undefined,
          subject: `Solicitare albait.ro: ${lead.interest} — ${lead.name}`,
          text: emailBody(lead, id, page),
        });
        await env.DB.prepare('UPDATE leads SET notified = 1 WHERE id = ?').bind(id).run();
      } catch (err) {
        // The lead is already stored; log and carry on.
        console.error('lead e-mail failed', id, err);
      }
    }

    return isForm ? Response.redirect(new URL('/multumim/', request.url), 303) : json({ ok: true, id });
  } catch (err) {
    console.error('lead storage failed', err);
    return fail(500, { ok: false, error: 'server' });
  }
};

export const ALL: APIRoute = () =>
  new Response('Method Not Allowed', { status: 405, headers: { allow: 'POST' } });
