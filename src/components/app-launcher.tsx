"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { categories, tools } from "@/lib/tools";
import { ToolIcon } from "@/components/tool-icon";

const featuredSlugs = ["word-counter", "image-resizer", "pdf-merger", "json-formatter", "percentage-calculator", "image-converter"];
const featuredTools = featuredSlugs.map((slug) => tools.find((tool) => tool.slug === slug)).filter((tool) => tool !== undefined);

export function AppLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const launcherRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      if (!launcherRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  function closeLauncher() {
    setIsOpen(false);
  }

  return (
    <div
      ref={launcherRef}
      className="app-launcher"
      data-open={isOpen}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          closeLauncher();
          triggerRef.current?.focus();
        }
      }}
    >
      <button
        ref={triggerRef}
        className="app-launcher-trigger"
        type="button"
        aria-label={isOpen ? "Close tools menu" : "Open tools menu"}
        aria-expanded={isOpen}
        aria-controls="app-launcher-panel"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="app-launcher-dots" aria-hidden="true">
          {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
        </span>
      </button>
      <div className="app-launcher-panel" id="app-launcher-panel" hidden={!isOpen}>
        <section className="launcher-featured">
          <h2>POPULAR TOOLS</h2>
          <div className="launcher-tool-grid">
            {featuredTools.map((tool) => (
              <Link className="launcher-tool" href={`/tools/${tool.slug}`} key={tool.slug} onClick={closeLauncher}>
                <ToolIcon className={`tool-glyph glyph-${tool.color}`} icon={tool.icon} />
                <span><strong>{tool.name}</strong><small>{tool.description}</small></span>
              </Link>
            ))}
          </div>
        </section>
        <section className="launcher-categories">
          <h2>BROWSE CATEGORIES</h2>
          <div className="launcher-category-list">
            {categories.map((category) => (
              <Link className="launcher-category" href={`/${category.slug}`} key={category.slug} onClick={closeLauncher}>
                <ToolIcon className={`category-icon glyph-${category.color}`} icon={category.icon} />
                <span>{category.name}</span>
                <small>{tools.filter((tool) => tool.categorySlug === category.slug).length}</small>
              </Link>
            ))}
          </div>
        </section>
        <section className="launcher-more">
          <h2>QUICKTOOLS</h2>
          <Link href="/#about" onClick={closeLauncher}>About us</Link>
          <Link href="/contact" onClick={closeLauncher}>Contact</Link>
          <Link href="/privacy" onClick={closeLauncher}>Privacy</Link>
          <Link href="/terms" onClick={closeLauncher}>Terms</Link>
          <div className="launcher-local-note"><span aria-hidden="true">●</span><span><strong>Private by design</strong><small>Your tools run in your browser.</small></span></div>
        </section>
      </div>
    </div>
  );
}
