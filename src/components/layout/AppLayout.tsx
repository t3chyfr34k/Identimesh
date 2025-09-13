
import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className={cn(
          "flex-1 px-4 md:px-6 py-4 md:py-8 overflow-auto",
          isMobile && sidebarOpen && "opacity-50 pointer-events-none"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}
