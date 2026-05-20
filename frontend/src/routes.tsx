import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Catalog } from "./pages/Catalog";
import { BookDetails } from "./pages/BookDetails";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { UserProfile } from "./pages/UserProfile";
import { Admin } from "./pages/Admin";
import { LibraryMap } from "./pages/LibraryMap";
import { SectorView } from "./pages/SectorView";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "catalog", Component: Catalog },
      { path: "book/:id", Component: BookDetails },
      { path: "map", Component: LibraryMap },
      { path: "sector/:sector", Component: SectorView },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "profile", Component: UserProfile },
      { path: "admin", Component: Admin },
    ],
  },
]);