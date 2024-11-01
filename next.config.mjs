import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // https://github.com/electric-sql/pglite/issues/322
    serverComponentsExternalPackages: ["@electric-sql/pglite"],
  },
};

export default withNextIntl(nextConfig);
