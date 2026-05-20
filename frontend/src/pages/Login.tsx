import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { BookOpen } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-2">BiblioTech</h1>
          <p className="text-muted-foreground">
            Acesse sua conta para continuar
          </p>
        </div>

        <Card>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span>Lembrar-me</span>
              </label>
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                Esqueceu a senha?
              </a>
            </div>

            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-primary hover:text-primary/80 transition-colors font-medium">
                Cadastre-se
              </Link>
            </p>
          </div>
        </Card>

        <Card className="mt-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/10">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📚</span>
            <div>
              <h4 className="mb-1">Novo por aqui?</h4>
              <p className="text-sm text-muted-foreground">
                Crie uma conta gratuita e tenha acesso a centenas de livros do nosso acervo digital
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
