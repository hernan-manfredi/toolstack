"use client";

import { useState } from "react";
import Link from "next/link";
import { categories, tools } from "@/lib/tools";

const availableCategories = categories.filter((category) =>
  tools.some((tool) => tool.categorySlug === category.slug),
);

export function ToolCatalog() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const visibleTools = activeCategory
    ? tools.filter((tool) => tool.categorySlug === activeCategory)
    : tools;

  return (
    <section className="section tool-catalog-section" aria-label="Browse tools">
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
            <span className={`tool-glyph glyph-${tool.color}`} aria-hidden="true">{tool.icon}</span>
            <strong>{tool.name}</strong>
            <span className="tool-card-description">{tool.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
