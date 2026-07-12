import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Static export has no image optimizer — sizes/loading attrs on <Image> control payload instead.
  images: { unoptimized: true },
  trailingSlash: true,
  async redirects() {
    return [
      { source: "/admin/design", destination: "/admin/design/", permanent: true },
    ];
  },
};

export default nextConfig;
