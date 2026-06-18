import { Home, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

export function AppHeader() {
  return (
    <header className="flex items-center h-12 border-b border-sidebar-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0 px-2 select-none w-full">
      {/* Home Button */}
      <Link href="/me">
        <button className="flex items-center justify-center size-8 hover:bg-sidebar-accent/50 rounded-md transition-colors text-muted-foreground hover:text-foreground shrink-0 mx-1">
          <Home className="size-4" />
        </button>
      </Link>

      {/* Tabs Area */}
      <div className="flex items-center h-full flex-1 overflow-x-auto no-scrollbar mask-linear-fade">
        <TabItem isActive={true} title="Dashboard" />
        <TabItem isActive={false} title="Explore Modules" />
        <TabItem isActive={false} title="Host Session" />
        
        <button className="flex items-center justify-center size-8 hover:bg-sidebar-accent/50 rounded-md transition-colors text-muted-foreground hover:text-foreground shrink-0 ml-1">
          <Plus className="size-4" />
        </button>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 shrink-0 ml-auto px-2">
      </div>
    </header>
  );
}

function TabItem({ isActive, title }: { isActive?: boolean; title: string }) {
  return (
    <div 
      className={cn(
        "flex items-center gap-2 h-full px-3 min-w-[120px] max-w-[200px] border-r border-sidebar-border/50 transition-colors group cursor-pointer relative",
        isActive ? "bg-sidebar-accent/30 text-foreground" : "text-muted-foreground hover:bg-sidebar-accent/20 hover:text-foreground"
      )}
    >
      <div className={cn("size-2.5 rounded-full border border-current opacity-70 shrink-0", isActive ? "text-emerald-500 bg-emerald-500/20" : "")} />
      <span className="text-xs font-medium truncate flex-1">{title}</span>
      <button className={cn(
        "opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-sm hover:bg-sidebar-accent",
        isActive && "opacity-100"
      )}>
        <X className="size-3" />
      </button>
      
      {/* Active Indicator Line */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
      )}
    </div>
  );
}
