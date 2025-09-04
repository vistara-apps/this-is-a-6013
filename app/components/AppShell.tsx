import { NavLink } from "@remix-run/react";
import { cn } from "~/utils/cn";
import { 
  LayoutDashboard, 
  Users, 
  Upload, 
  CheckSquare, 
  BarChart3,
  Settings,
  Database
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
  variant?: "default" | "sidebarLeft";
}

export function AppShell({ children, variant = "sidebarLeft" }: AppShellProps) {
  if (variant === "sidebarLeft") {
    return (
      <div className="min-h-screen gradient-bg">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64 p-6">
            <div className="container-fluid animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container-fluid py-6 animate-fade-in">
        {children}
      </div>
    </div>
  );
}

function Sidebar() {
  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Customers",
      href: "/customers",
      icon: Users,
    },
    {
      name: "Data Import",
      href: "/import",
      icon: Upload,
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: CheckSquare,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
    {
      name: "Data Sources",
      href: "/data-sources",
      icon: Database,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="sidebar-left">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-[var(--color-primary)] rounded-[var(--radius-sm)] flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
              ScribeSync
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Customer Data Pipeline
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-all duration-[var(--duration-fast)]",
                  isActive
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-gray-100"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
        <div className="text-xs text-[var(--color-text-secondary)]">
          <p>© 2024 ScribeSync</p>
          <p>v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
