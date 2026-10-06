import Link from "next/link";
import { categories, tools } from "@/lib/tools";
import { ThemeToggle } from "@/components/theme-toggle";

const categoryCounts = categories.map((category) => ({
  ...category,
  count: tools.filter((tool) => tool.categorySlug === category.slug).length,
}));

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="ToolStack home">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
          <span>toolstack<span className="brand-period">.</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="/#popular">All tools</Link>
          <details className="category-menu">
            <summary>Categories <span aria-hidden="true">⌄</span></summary>
            <div className="category-dropdown">
              {categoryCounts.map((category) => (
                <Link className="category-menu-item" href={`/${category.slug}`} key={category.slug}>
                  <span className={`category-icon glyph-${category.color}`}>{category.icon}</span>
                  <span><strong>{category.name}</strong><small>{category.count ? `${category.count} ${category.count === 1 ? "tool" : "tools"}` : "Coming soon"}</small></span>
                  <span className="category-arrow" aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          </details>
          <Link href="/#about">About</Link>
        </nav>
        <div className="header-actions">
          <Link className="header-link" href="/tools/word-counter">Try Word Counter <span aria-hidden="true">↗</span></Link>
          <ThemeToggle />
        </div>
      </header>
      <div className="page-grid">
        <div className="page-content">{children}</div>
      </div>
      <footer className="site-footer">
        <Link className="brand footer-brand" href="/"><span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span><span>toolstack<span className="brand-period">.</span></span></Link>
        <span>Small tools for the things that add up.</span>
        <nav aria-label="Footer navigation"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/contact">Contact</Link></nav>
        <span className="copyright">© 2026 ToolStack</span>
      </footer>
    </>
  );
}