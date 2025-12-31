import { MessengerSidebar } from "./_components/messenger-sidebar";

export default function MessengerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-[600px]">
      <MessengerSidebar />
      <div className="flex-1 md:ml-0">{children}</div>
    </div>
  );
}
