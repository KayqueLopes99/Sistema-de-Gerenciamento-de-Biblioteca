import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { JSX } from "react/jsx-runtime";

export function ProtectedRoute({ children, requireBibliotecario = false }: { children: JSX.Element; requireBibliotecario?: boolean }) {
  const { isAuthenticated, isBibliotecario } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (requireBibliotecario && !isBibliotecario) return <Navigate to="/" />;
  return children;
}