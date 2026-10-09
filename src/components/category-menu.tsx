"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { categories, tools } from "@/lib/tools";
import { ToolIcon } from "@/components/tool-icon";

const categoryCounts = categories.map((category) => ({
  ...category,
  count: tools.filter((tool) => tool.categorySlug === category.slug).length,
}));

export function CategoryMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div
      className="category-menu"
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
        className="category-menu-trigger"
        type="button"
        aria-expanded={isOpen}
        aria-controls="category-dropdown"
        onClick={() => setIsOpen((open) => !open)}
      >
        Categories <span className="nav-chevron" aria-hidden="true" />
      </button>
      <div
        className="category-dropdown"
        id="category-dropdown"
        hidden={!isOpen}
      >
        {categoryCounts.map((category) => (
          <Link className="category-menu-item" href={`/${category.slug}`} key={category.slug}>
            <ToolIcon className={`category-icon glyph-${category.color}`} icon={category.icon} />
            <span><strong>{category.name}</strong><small>{category.count ? `${category.count} ${category.count === 1 ? "tool" : "tools"}` : "Coming soon"}</small></span>
            <span className="category-arrow" aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
