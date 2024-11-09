import { use } from "react";

import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/toaster";
import { Locale } from "@/lib/i18n/locale";
import { routing } from "@/lib/i18n/routing";

import Providers from "../providers";

import type { Metadata } from "next";

import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export async function generateStaticParams() {
  return Object.values(Locale).map((locale) => ({ locale }));
}

export default function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: Locale }>;
  }>
) {
  const params = use(props.params);

  const { locale } = params;

  const { children } = props;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = useMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <Providers>{children}</Providers>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
