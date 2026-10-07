"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { categories, tools } from "@/lib/tools";

const toolGroups = categories
  .map((category) => ({
    ...category,
    tools: tools.filter((tool) => tool.categorySlug === category.slug),
  }))
  .filter((category) => category.tools.length > 0);

export function AllToolsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div
      className="all-tools-menu"
      data-open={isOpen}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={(event) => {
        if (!event.currentTarget.contains(document.activeElement)) setIsOpen(false);
      }}
      onFocus={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(true);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(event.currentTarget.matches(":hover"));
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setIsOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <button
        ref={triggerRef}
        className="all-tools-trigger"
        type="button"
        aria-expanded={isOpen}
        aria-controls="all-tools-dropdown"
        onClick={() => setIsOpen((open) => !open)}
      >
        All tools <span className="nav-chevron" aria-hidden="true" />
      </button>
      <div
        className="all-tools-dropdown"
        id="all-tools-dropdown"
        hidden={!isOpen}
      >
        {toolGroups.map((category) => (
          <section className="all-tools-group" key={category.slug}>
            <Link className="all-tools-heading" href={`/${category.slug}`}>
              {category.name}
            </Link>
            <ul>
              {category.tools.map((tool) => (
                <li key={tool.slug}>
                  <Link className="all-tools-item" href={`/tools/${tool.slug}`}>
                    <span className={`tool-glyph glyph-${category.color}`} aria-hidden="true">
                      {tool.icon}
                    </span>
                    <span>{tool.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
