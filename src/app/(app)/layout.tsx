// app/(app)/layout.tsx
import { NotificationProvider } from "@/contexts/NotificationContext";
import NotificationContainer from "@/components/feedback/Notification";
import { Sidebar } from "@/components/layout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      <div className="flex">
        <Sidebar />
        {children}
      </div>
      <NotificationContainer />
    </NotificationProvider>
  );
}
