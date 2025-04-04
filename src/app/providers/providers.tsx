import { NextIntlClientProvider, useMessages } from "next-intl";
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import CookieDispatcher from "./cookie-dispatcher";
import NavigationProgress from "./navigation-progress";
import Notifier from "./notifier";
import ReactQueryProvider from "./react-query-provider";
import ScrollRestorerer from "./scroll-restorerer";

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
          <NavigationProgress />
          <CookieDispatcher />
          <ScrollRestorerer />
          <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
        </ReactQueryProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
