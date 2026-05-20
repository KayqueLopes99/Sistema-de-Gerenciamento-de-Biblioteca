import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { BookOpen } from "lucide-react";

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-2">Criar Conta</h1>
          <p className="text-muted-foreground">
            Junte-se à nossa comunidade de leitores
          </p>
        </div>

        <Card>
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Nome completo"
              type="text"
              placeholder="Seu nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <Input
              label="Confirmar senha"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 mt-1 rounded border-gray-300 text-primary focus:ring-primary" required />
              <span className="text-sm">
                Concordo com os{" "}
                <a href="#" className="text-primary hover:text-primary/80">
                  Termos de Uso
                </a>{" "}
                e{" "}
                <a href="#" className="text-primary hover:text-primary/80">
                  Política de Privacidade
                </a>
              </span>
            </label>

            <Button type="submit" className="w-full">
              Criar Conta
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">
                Fazer login
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
