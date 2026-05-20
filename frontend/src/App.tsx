import { RouterProvider } from "react-router";
import { router } from "./routes";
import { LibraryProvider } from "./context/LibraryContext";
import { Toaster } from "sonner";

export default function App() {
  return (
    <LibraryProvider>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </LibraryProvider>
  );
}