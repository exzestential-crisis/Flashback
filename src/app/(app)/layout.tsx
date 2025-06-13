// app/(app)/layout.tsx
"use client";

import { NotificationProvider } from "@/contexts/NotificationContext";
import NotificationContainer from "@/components/feedback/Notification";

import { Sidebar } from "@/components/layout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      <div className="flex">
        <div className="z-50">
          <Sidebar />
        </div>
        {children}
      </div>
      <NotificationContainer />
    </NotificationProvider>
  );
}
