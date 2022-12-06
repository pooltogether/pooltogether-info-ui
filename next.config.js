const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  async redirects() {
    return [{
      source: "/",
      destination: "/treasury",
      permanent: false
    }];
  },
  webpack(config, options) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@abis": path.resolve(__dirname, "./src/abis"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@constants": path.resolve(__dirname, "./src/constants"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@interfaces": path.resolve(__dirname, "./src/interfaces"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    };
    return config;
  },
};

module.exports = nextConfig;
