import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/app-sidebar";
import { ReactNode } from "react";

export default function ApplicationLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-svh w-full bg-background overflow-hidden">
      <SidebarProvider className="flex-1 min-h-0 h-full overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col h-full bg-background overflow-hidden border-t border-sidebar-border/50">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
