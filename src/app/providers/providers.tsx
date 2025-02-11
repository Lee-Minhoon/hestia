import { NextIntlClientProvider, useMessages } from "next-intl";
import { ThemeProvider } from "next-themes";

import ReactQueryProvider from "./react-query-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const messages = useMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
