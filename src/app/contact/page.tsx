import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact information for ToolStack.",
  alternates: { canonical: "/contact" },
  robots: { index: false, follow: true },
};

export default function ContactPage() {
  return (
    <main className="tool-page legal-page">
      <p className="eyebrow">Get in touch</p>
      <h1>Contact</h1>
      <p>A monitored contact address will be published here before ToolStack opens to the public.</p>
    </main>
  );
}