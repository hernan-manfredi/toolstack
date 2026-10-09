"use client";

import { useState } from "react";
import Link from "next/link";
import { categories, tools } from "@/lib/tools";
import { ToolCardIcon } from "@/components/tool-card-icon";

const popularToolOrder = [
  "percentage-calculator",
  "pdf-merger",
  "pdf-splitter",
  "word-counter",
  "image-compressor",
  "image-resizer",
  "image-converter",
  "random-number-generator",
  "json-formatter",
  "case-converter",
  "url-encoder-decoder",
  "base64-encoder-decoder",
  "json-minifier",
  "text-cleaner",
  "slug-generator",
  "lorem-ipsum-generator",
  "uuid-generator",
];

const popularityRank = new Map(popularToolOrder.map((slug, index) => [slug, index]));
const popularTools = [...tools].sort(
  (a, b) =>
    (popularityRank.get(a.slug) ?? popularToolOrder.length) -
    (popularityRank.get(b.slug) ?? popularToolOrder.length),
);

const availableCategories = categories.filter((category) =>
  tools.some((tool) => tool.categorySlug === category.slug),
);

export function ToolCatalog() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const visibleTools = activeCategory
    ? popularTools.filter((tool) => tool.categorySlug === activeCategory)
    : popularTools;

  return (
    <section className="section tool-catalog-section" aria-label="Browse tools">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Popular</p>
          <h2>Tools people reach for first</h2>
        </div>
      </div>
      <div className="catalog-filters" role="group" aria-label="Filter tools by category">
        <button
          className="catalog-filter"
          type="button"
          aria-pressed={activeCategory === null}
          onClick={() => setActiveCategory(null)}
        >
          All
        </button>
        {availableCategories.map((category) => (
          <button
            className="catalog-filter"
            type="button"
            key={category.slug}
            aria-pressed={activeCategory === category.slug}
            onClick={() => setActiveCategory(category.slug)}
          >
            {category.name}
          </button>
        ))}
      </div>
      <div className="tool-card-grid" aria-live="polite">
        {visibleTools.map((tool) => (
          <Link className="tool-card" href={`/tools/${tool.slug}`} key={tool.slug}>
            <span className={`tool-card-art glyph-${tool.color}`} aria-hidden="true">
              <ToolCardIcon slug={tool.slug} />
            </span>
            <strong>{tool.name}</strong>
            <span className="tool-card-description">{tool.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
