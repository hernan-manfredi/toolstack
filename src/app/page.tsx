import Link from "next/link";
import { ToolCatalog } from "@/components/tool-catalog";
import { ToolIcon } from "@/components/tool-icon";
import { categories, tools } from "@/lib/tools";

const categoryCounts = categories.map((category) => ({
  ...category,
  count: tools.filter((tool) => tool.categorySlug === category.slug).length,
}));

export default function Home() {
  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-copy">
          <h1>Free calculators, <span>converters & online tools</span></h1>
          <p className="hero-description">Helpful tools for money, work, writing, technology, and everyday life.</p>
        </div>
      </section>
      <ToolCatalog />

          <section className="section category-section" id="categories">
            <div className="section-heading"><div><p className="eyebrow">Browse by category</p><h2>One place for everyday tools</h2></div><span className="section-count">{categories.length} categories</span></div>
            <div className="category-grid">
              {categoryCounts.map((category, index) => (
                <Link className="category-card" href={`/${category.slug}`} key={category.slug}>
                  <ToolIcon className={`category-icon glyph-${category.color}`} icon={category.icon} />
                  <span className="category-meta"><strong>{category.name}</strong><small>{category.count ? `${category.count} ${category.count === 1 ? "tool" : "tools"} available` : "Coming soon"}</small></span>
                  <span className="category-arrow" aria-hidden="true">↗</span>
                  <span className="card-index">0{index + 1}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="privacy-strip" id="about">
            <span className="privacy-mark" aria-hidden="true">✳</span>
            <div><strong>Less uploading. More doing.</strong><p>Text and code tools run in your browser. Your inputs stay in this tab.</p></div>
            <span className="privacy-tag">PRIVATE BY DESIGN</span>
          </section>
    </main>
  );
}
