import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Initial terms for using the ToolStack online utilities.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="tool-page legal-page">
      <p className="eyebrow">Before you use the tools</p>
      <h1>Terms of use</h1>
      <p className="legal-updated">Last updated: September 26, 2026</p>
      <p>This initial draft covers the current ToolStack tools. It needs review for the operator&apos;s jurisdiction and business model before public launch.</p>
      <h2>Using the tools</h2>
      <p>You may use the tools for lawful purposes. You are responsible for the content you enter and for checking that any output is suitable for your needs.</p>
      <h2>Availability and results</h2>
      <p>The tools are provided as-is, without a guarantee that every result is error-free or suitable for a particular purpose. Keep your own copy of important source data and verify important results independently.</p>
      <h2>Changes</h2>
      <p>Tools and these terms may change as the service develops. A public launch should include the operator&apos;s legal name, effective date and a way to contact them about these terms.</p>
      <h2>Contact</h2>
      <p>Operator and contact details are not configured in this development version and must be added before launch.</p>
    </main>
  );
}