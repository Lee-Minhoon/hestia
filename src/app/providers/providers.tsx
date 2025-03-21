import { NextIntlClientProvider, useMessages } from "next-intl";
import { ThemeProvider } from "next-themes";

import { TopProgressBar } from "@/components/top-progress-bar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import NavigationProgress from "./navigation-progress";
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
          <TopProgressBar />
          <NavigationProgress />
          <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
        </ReactQueryProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
