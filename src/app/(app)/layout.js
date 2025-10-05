// src/app/(app)/layout.js
import ClientLayout from "@/components/appLayout/ClientLayout";
export default function AppLayout({ children }) {
  return (
    <ClientLayout>{children}</ClientLayout>
  );
}