import Link from "next/link";
import { AllToolsMenu } from "@/components/all-tools-menu";
import { CategoryMenu } from "@/components/category-menu";
import { AppLauncher } from "@/components/app-launcher";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="quicktools-online.com home">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
          <span>quicktools-online.com</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <AllToolsMenu />
          <CategoryMenu />
          <Link href="/#about">About</Link>
        </nav>
        <AppLauncher />
      </header>
      <div className="page-grid">
        <div className="page-content">{children}</div>
      </div>
      <footer className="site-footer">
        <Link className="brand footer-brand" href="/"><span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span><span>quicktools-online.com</span></Link>
        <span>Small tools for the things that add up.</span>
        <nav aria-label="Footer navigation"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/contact">Contact</Link></nav>
        <span className="copyright">© 2026 quicktools-online.com</span>
      </footer>
    </>
  );
}