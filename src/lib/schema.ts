// JSON-LD builders. Only properties backed by verified data are emitted:
// no prices, offers, ratings or reviews (ALBA IT has not published them).
import { company } from '@/data/site';
import type { Product } from '@/data/products';
import type { Service } from '@/data/services';
import type { FaqItem } from '@/data/faq';

const SITE = company.url;
export const ORG_ID = `${SITE}/#organization`;

export const abs = (path: string) => new URL(path, SITE).toString();

export function organizationSchema(logoUrl: string) {
  return {
    '@type': ['LocalBusiness', 'Store'],
    '@id': ORG_ID,
    name: company.brand,
    legalName: company.legalName,
    url: `${SITE}/`,
    logo: abs(logoUrl),
    image: abs(logoUrl),
    telephone: company.phone.e164,
    email: company.email,
    vatID: company.cui,
    taxID: company.cui,
    foundingDate: company.founded,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.showroom.street,
      addressLocality: company.showroom.city,
      addressRegion: company.showroom.county,
      addressCountry: company.showroom.country,
    },
    areaServed: { '@type': 'AdministrativeArea', name: 'Județul Alba' },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: company.hours.opens,
        closes: company.hours.closes,
      },
    ],
    sameAs: [company.facebook],
    knowsAbout: ['case de marcat fiscale', 'service case de marcat', 'mentenanță IT', 'configurare servere', 'audit de securitate IT'],
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE}/#website`,
    url: `${SITE}/`,
    name: company.brand,
    inLanguage: 'ro-RO',
    publisher: { '@id': ORG_ID },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

export function productSchema(p: Product, imageUrls: string[]) {
  return {
    '@type': 'Product',
    '@id': `${abs(`/case-de-marcat/${p.slug}/`)}#product`,
    name: p.name,
    model: p.model,
    category: 'Casă de marcat fiscală',
    description: p.summary,
    brand: { '@type': 'Brand', name: p.brand },
    image: imageUrls.map(abs),
    url: abs(`/case-de-marcat/${p.slug}/`),
    additionalProperty: p.specs.map((s) => ({ '@type': 'PropertyValue', name: s.label, value: s.value })),
  };
}

export function serviceSchema(s: Service) {
  return {
    '@type': 'Service',
    '@id': `${abs(`/servicii/${s.slug}/`)}#service`,
    name: s.title,
    description: s.intro,
    serviceType: s.title,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'AdministrativeArea', name: 'Județul Alba' },
    url: abs(`/servicii/${s.slug}/`),
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function graph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
