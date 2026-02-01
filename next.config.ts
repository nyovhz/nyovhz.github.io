import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  basePath: "/nyovhz.github.io",
  assetPrefix: "/nyovhz.github.io/",

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.(glsl|vert|frag)$/,
      type: "asset/source",
    });
    return config;
  },
};

export default nextConfig;
