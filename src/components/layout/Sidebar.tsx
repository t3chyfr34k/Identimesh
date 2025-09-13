
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { X, Home, Search, History, Settings, LogOut } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { logout } = useAuth();

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile && open) {
      setOpen(false);
    }
  }, [location.pathname, isMobile]);

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Home className="w-5 h-5" />,
    },
    {
      name: "Search Profiles",
      path: "/search",
      icon: <Search className="w-5 h-5" />,
    },
    {
      name: "Match History",
      path: "/history",
      icon: <History className="w-5 h-5" />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar fixed md:static inset-y-0 left-0 z-50 w-64 transition-transform duration-300 flex flex-col border-r border-border",
          isMobile && !open && "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <h1 className="text-xl font-bold text-foreground">IdentiMesh</h1>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <div className="flex-1 overflow-auto py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  location.pathname === item.path ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                )}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Button>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}
