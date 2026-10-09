import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategory, getCategoryTools } from "@/lib/tools";
import { siteUrl } from "@/lib/site";
import { ToolIcon } from "@/components/tool-icon";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return categories.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  const availableTools = getCategoryTools(slug);
  return {
    title: `Free ${category.name} Online`,
    description: category.description,
    alternates: { canonical: `/${slug}` },
    robots: availableTools.length ? undefined : { index: false, follow: true },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const categoryTools = getCategoryTools(slug);
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: category.name, item: `${siteUrl}/${slug}` },
    ],
  };

  return (
    <main className="tool-page category-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</gu, "\\u003c") }} />
      <nav className="breadcrumbs" aria-label="Breadcrumbs"><Link href="/">Home</Link><span>/</span><span aria-current="page">{category.name}</span></nav>
      <header className="tool-page-header category-page-header">
        <ToolIcon className={`category-icon glyph-${category.color}`} icon={category.icon} />
        <p className="eyebrow">Tool collection</p>
        <h1>Free {category.name} online</h1>
        <p>{category.description}</p>
      </header>
      {categoryTools.length ? <div className="category-tool-list">{categoryTools.map((tool) => <Link className="tool-row" href={`/tools/${tool.slug}`} key={tool.slug}><ToolIcon className={`tool-glyph glyph-${tool.color}`} icon={tool.icon} /><span className="tool-row-copy"><strong>{tool.name}</strong><small>{tool.description}</small></span><span className="tool-open" aria-hidden="true">↗</span></Link>)}</div> : <p className="coming-soon">We are building useful tools for this collection. In the meantime, explore the available tools below.</p>}
      <section className="guide-section"><h2>Explore all collections</h2><div className="related-grid">{categories.filter((item) => item.slug !== slug).map((item) => <Link className="related-tool" href={`/${item.slug}`} key={item.slug}><ToolIcon className={`category-icon glyph-${item.color}`} icon={item.icon} /><span><strong>{item.name}</strong><small>{item.description}</small></span><span aria-hidden="true">↗</span></Link>)}</div></section>
    </main>
  );
}