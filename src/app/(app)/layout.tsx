import { NotificationProvider } from "@/contexts/NotificationContext";
import NotificationContainer from "@/components/feedback/Notification";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider>
          {children}
          <NotificationContainer />
        </NotificationProvider>
      </body>
    </html>
  );
}
