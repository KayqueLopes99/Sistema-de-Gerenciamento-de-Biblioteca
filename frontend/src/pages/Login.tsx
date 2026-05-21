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
  const [erro, setErro] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    try {
      const response = await fetch("http://localhost:8080/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email, 
          senha: password // Bate exatamente com o 'senha' do LoginRequestDTO
        }),
      });

      if (!response.ok) {
        throw new Error("E-mail ou senha incorretos.");
      }

      const data = await response.json();
      
      // Salva o token que o LoginResponseDTO do grupo gerar
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      
      // Joga para o Dashboard lindo do grupo
      navigate("/"); 
    } catch (err: any) {
      setErro(err.message || "Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">Acessar BiblioTech</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta! Faça login para continuar.
          </p>
        </div>

        <Card>
          {erro && <p className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm text-center">{erro}</p>}

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
      </div>
    </div>
  );
}