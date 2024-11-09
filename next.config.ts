import createNextIntlPlugin from "next-intl/plugin";

import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

const nextConfig: NextConfig = {
  // https://github.com/electric-sql/pglite/issues/322#issuecomment-2372563526
  serverExternalPackages: ["@electric-sql/pglite"],
};

export default withNextIntl(nextConfig);
