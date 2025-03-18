import { NextIntlClientProvider, useMessages } from "next-intl";
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import Notifier from "./notifier";
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
        <ReactQueryProvider>
          <Toaster />
          <Notifier />
          <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
        </ReactQueryProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
