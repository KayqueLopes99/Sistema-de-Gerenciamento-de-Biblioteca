import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { autoCadastro } from "../services/api";
import { BookOpen } from "lucide-react";

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmPassword: "",
    cpf: "",
    matricula: "",
  });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (formData.senha !== formData.confirmPassword) {
      setErro("As senhas não coincidem!");
      return;
    }
    
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (!passwordRegex.test(formData.senha)) {
      setErro("A senha deve conter entre 6 e 20 caracteres, com pelo menos uma letra maiúscula, uma minúscula e um número.");
      return;
    }

    if (formData.cpf.length !== 11) {
      setErro("CPF deve conter 11 dígitos numéricos");
      return;
    }
    if (formData.matricula.length < 10) {
      setErro("Matrícula deve ter pelo menos 10 dígitos");
      return;
    }

    setLoading(true);
    try {
      await autoCadastro({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        cpf: formData.cpf,
        matricula: formData.matricula,
      });
      setSucesso(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      console.error("Erro detalhado:", err);
      setErro(err.message || "Erro ao realizar cadastro. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">Criar Conta</h1>
          <p className="text-muted-foreground">Junte-se à nossa comunidade de leitores</p>
        </div>

        <Card>
          {sucesso && (
            <p className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
              Cadastro realizado! Aguarde aprovação.
            </p>
          )}
          {erro && (
            <p className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm whitespace-pre-wrap">
              {erro}
            </p>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Nome completo"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
            <Input
              label="E-mail"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="CPF (apenas números)"
              value={formData.cpf}
              onChange={(e) => setFormData({ ...formData, cpf: e.target.value.replace(/\D/g, "") })}
              maxLength={11}
              required
            />
            <Input
              label="Matrícula"
              value={formData.matricula}
              onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
              required
            />
            <Input
              label="Senha"
              type="password"
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              required
            />
            <Input
              label="Confirmar senha"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Cadastrando..." : "Criar Conta"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/login" className="text-primary hover:underline">
              Já tem conta? Faça login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}