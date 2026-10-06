import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ToolNest handles tool inputs and website visit data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="tool-page legal-page">
      <p className="eyebrow">The short version</p>
      <h1>Privacy policy</h1>
      <p className="legal-updated">Last updated: September 26, 2026</p>
      <p>ToolNest is being built around small tools that do their work in your browser. This draft describes the current implementation and must be reviewed and completed for the country where the site is operated before public launch.</p>
      <h2>Tool inputs</h2>
      <p>The text, code and calculator tools currently available process your input in the open browser tab. They do not upload that input to ToolNest servers. Do not treat this as a guarantee for tools added later; each new tool must explain its own processing before it is published.</p>
      <h2>Website visits</h2>
      <p>The hosting provider may process standard request information, such as IP address, requested page and request time, to deliver and protect the website. Hosting and retention details should be added here before launch.</p>
      <h2>Cookies, analytics and advertising</h2>
      <p>When Google AdSense is enabled, Google and its advertising partners may use cookies or similar technologies and process information such as your IP address, browser and device details, and ad interactions to provide, measure, and personalize ads. Ad personalization and consent choices depend on your location and the controls presented to you. See <a href="https://policies.google.com/technologies/ads">Google&apos;s information about advertising technologies</a> for details. Before enabling ads for visitors in the EEA, UK, or Switzerland, the site operator must configure and publish an appropriate Google-certified consent message. Analytics are not configured.</p>
      <h2>Contact</h2>
      <p>A monitored privacy contact address has not been configured yet. Add the operator&apos;s contact details before publishing this policy.</p>
    </main>
  );
}