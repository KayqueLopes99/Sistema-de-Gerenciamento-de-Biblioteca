import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard";
import { Catalog } from "./pages/Catalog";
import { BookDetails } from "./pages/BookDetails";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { UserProfile } from "./pages/UserProfile";
import { Admin } from "./pages/Admin/Admin";
import { LibraryMap } from "./pages/LibraryMap";
import { SectorView } from "./pages/SectorView";

export const router = createBrowserRouter([
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },
  {
    path: "/",
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      { index: true, Component: Dashboard },
      { path: "catalog", Component: Catalog },
      { path: "book/:id", Component: BookDetails },
      { path: "map", Component: LibraryMap },
      { path: "sector/:sector", Component: SectorView },
      { 
        path: "profile", 
        element: <ProtectedRoute><UserProfile /></ProtectedRoute> 
      },
      { 
        path: "admin", 
        element: <ProtectedRoute requireBibliotecario><Admin /></ProtectedRoute> 
      },
    ],
  },
]);