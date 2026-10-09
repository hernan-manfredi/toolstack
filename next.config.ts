import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/images-files", destination: "/images", permanent: true },
      { source: "/pdf-tools", destination: "/files", permanent: true },
      { source: "/image-tools", destination: "/images", permanent: true },
      { source: "/text-tools", destination: "/text-writing", permanent: true },
      { source: "/developer-tools", destination: "/internet-technology", permanent: true },
      { source: "/file-converters", destination: "/conversion", permanent: true },
      { source: "/generators", destination: "/random-fun", permanent: true },
      { source: "/calculators", destination: "/math-numbers", permanent: true },
    ];
  },
};

export default nextConfig;
