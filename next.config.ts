import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  async redirects() {
    return [
      { source: "/admin/design", destination: "/admin/design/", permanent: true },
    ];
  },
};

export default nextConfig;
