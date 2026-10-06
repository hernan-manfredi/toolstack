"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { categories, tools } from "@/lib/tools";

const categoryCounts = categories.map((category) => ({
  ...category,
  count: tools.filter((tool) => tool.categorySlug === category.slug).length,
}));

export default function Home() {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const results = query.trim()
    ? tools.filter((tool) => `${tool.name} ${tool.category} ${tool.description} ${tool.tags}`.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : [];

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-copy">
          <p className="hero-badge"><span className="status-dot" /> Free tools, no fuss</p>
          <h1>Small tools.<br />Big <span>time savers.</span></h1>
          <p className="hero-description">Handy tools for writing, coding and everyday tasks. Fast, private, and ready when you are.</p>
          <form className="search-box" onSubmit={(event) => event.preventDefault()}>
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              ref={searchRef}
              type="search"
              placeholder="What do you need to do?"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search online tools"
            />
            <button className="search-submit" type="submit">Search</button>
            <kbd>Ctrl K</kbd>
          </form>
          {query && (
            <div className="search-results" role="region" aria-label="Search results">
              {results.length ? results.map((tool) => (
                <Link className="search-result" href={`/tools/${tool.slug}`} key={tool.slug}>
                  <span className={`tool-glyph glyph-${tool.color}`}>{tool.icon}</span>
                  <span><strong>{tool.name}</strong><small>{tool.category}</small></span>
                  <span className="result-arrow" aria-hidden="true">↗</span>
                </Link>
              )) : <p className="empty-search">No tools found. Try another search.</p>}
            </div>
          )}
          <div className="popular-searches">
            <span>Popular:</span>
            <Link href="/tools/word-counter">Word Counter</Link>
            <Link href="/tools/json-formatter">JSON Formatter</Link>
            <Link href="/tools/slug-generator">Slug Generator</Link>
          </div>
          <div className="hero-promises"><span>✓ No signup</span><span>✓ No uploads</span><span>✓ Free to use</span></div>
        </div>
      </section>

          <section className="section category-section" id="categories">
            <div className="section-heading"><div><p className="eyebrow">Find your corner</p><h2>Tools for every kind of task</h2></div><span className="section-count">{categories.length} collections</span></div>
            <div className="category-grid">
              {categoryCounts.map((category, index) => (
                <Link className="category-card" href={`/${category.slug}`} key={category.slug}>
                  <span className={`category-icon glyph-${category.color}`}>{category.icon}</span>
                  <span className="category-meta"><strong>{category.name}</strong><small>{category.count ? `${category.count} ${category.count === 1 ? "tool" : "tools"} available` : "Coming soon"}</small></span>
                  <span className="category-arrow" aria-hidden="true">↗</span>
                  <span className="card-index">0{index + 1}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="section popular-section" id="popular">
            <div className="section-heading"><div><p className="eyebrow">A good place to start</p><h2>Popular right now</h2></div><span className="section-count">{tools.length} useful tools</span></div>
            <div className="tool-list">
              {tools.slice(0, 8).map((tool, index) => (
                <a className="tool-row" href={`/tools/${tool.slug}`} key={tool.slug}>
                  <span className={`tool-glyph glyph-${tool.color}`}>{tool.icon}</span>
                  <span className="tool-row-copy"><strong>{tool.name}</strong><small>{tool.description}</small></span>
                  <span className="tool-category">{tool.category}</span>
                  <span className="tool-open" aria-label={`Open ${tool.name}`}>↗</span>
                  <span className="tool-number">{String(index + 1).padStart(2, "0")}</span>
                </a>
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
