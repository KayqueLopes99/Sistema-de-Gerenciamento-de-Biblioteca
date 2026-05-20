import { Outlet, Link, useLocation } from "react-router";
import { BookOpen, Home, Library, User, Settings, LogOut, Map } from "lucide-react";
import { Toaster } from "sonner";

export function Layout() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-background">
      <Toaster position="top-right" richColors />
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">BiblioTech</h1>
              <p className="text-xs text-sidebar-foreground/70">Biblioteca Digital</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive("/")
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "hover:bg-sidebar-accent/50"
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/catalog"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive("/catalog")
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "hover:bg-sidebar-accent/50"
                }`}
              >
                <Library className="w-5 h-5" />
                <span>Catálogo</span>
              </Link>
            </li>
            <li>
              <Link
                to="/map"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive("/map")
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "hover:bg-sidebar-accent/50"
                }`}
              >
                <Map className="w-5 h-5" />
                <span>Mapa da Biblioteca</span>
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive("/profile")
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "hover:bg-sidebar-accent/50"
                }`}
              >
                <User className="w-5 h-5" />
                <span>Meu Perfil</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive("/admin")
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "hover:bg-sidebar-accent/50"
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Administração</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Link
            to="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent/50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
