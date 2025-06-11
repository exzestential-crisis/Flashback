"use client";

import { ThemeProvider } from "next-themes";
import { useLoadingStore } from "@/store/LoadingStore";
import NotificationContainer from "@/components/feedback/Notification";
import { NotificationProvider } from "@/contexts/NotificationContext";
import AnimatedWrapper from "@/components/ui/AnimatedWrapper";
import { CardLoading } from "@/components";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useLoadingStore();

  return (
    <ThemeProvider attribute="class">
      <NotificationProvider>
        <AnimatedWrapper>
          {isLoading && <CardLoading />}
          {children}
        </AnimatedWrapper>
        <NotificationContainer />
      </NotificationProvider>
    </ThemeProvider>
  );
}
