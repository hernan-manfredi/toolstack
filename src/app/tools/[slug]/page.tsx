import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolWorkbench } from "@/components/tool-workbench";
import { getRelatedTools, getTool, tools } from "@/lib/tools";
import { siteUrl } from "@/lib/site";
import { ToolIcon } from "@/components/tool-icon";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return tools.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return {
    title: tool.title,
    description: tool.intro,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: { title: tool.title, description: tool.intro, type: "website" },
    twitter: { card: "summary", title: tool.title, description: tool.intro },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();
  const related = getRelatedTools(tool);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: tool.name,
        description: tool.intro,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: `${siteUrl}/tools/${tool.slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: tool.category, item: `${siteUrl}/${tool.categorySlug}` },
          { "@type": "ListItem", position: 3, name: tool.name, item: `${siteUrl}/tools/${tool.slug}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: tool.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
      },
    ],
  };

  return (
    <main className="tool-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</gu, "\\u003c") }} />
      <nav className="breadcrumbs" aria-label="Breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href={`/${tool.categorySlug}`}>{tool.category}</Link><span>/</span><span aria-current="page">{tool.name}</span></nav>
      <header className="tool-page-header">
        <ToolIcon className={`tool-glyph glyph-${tool.color}`} icon={tool.icon} />
        <p className="eyebrow">{tool.category}</p>
        <h1>{tool.name}</h1>
        <p>{tool.intro}</p>
      </header>
      <ToolWorkbench tool={tool} />
      <section className="guide-section"><h2>How to use {tool.name}</h2><ol className="tool-steps">{tool.steps.map((step, index) => <li key={step}><span className="step-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span>{step}</span></li>)}</ol></section>
      <section className="guide-section"><h2>Common questions</h2>{tool.faqs.map((faq) => <details className="faq-item" key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>
      <section className="guide-section related-section"><div className="section-heading"><div><p className="eyebrow">Keep going</p><h2>Related tools</h2></div><Link href={`/${tool.categorySlug}`}>All {tool.category.toLowerCase()} <span aria-hidden="true">↗</span></Link></div><div className="related-grid">{related.map((item) => <Link className="related-tool" href={`/tools/${item.slug}`} key={item.slug}><ToolIcon className={`tool-glyph glyph-${item.color}`} icon={item.icon} /><span><strong>{item.name}</strong><small>{item.description}</small></span><span aria-hidden="true">↗</span></Link>)}</div></section>
    </main>
  );
}