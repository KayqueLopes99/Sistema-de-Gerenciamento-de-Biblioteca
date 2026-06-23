import { useState, useEffect } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Input } from "../components/Input";
import { useAuth } from "../context/AuthContext";
import {
  meusEmprestimos,
  historicoLeitor,
  solicitarRenovacao,
  listarFavoritos,
  listarTodosEmprestimos,
} from "../services/api";
import { BookOpen, Clock, CheckCircle, Edit, X } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router";

export function UserProfile() {
  const { user, isAuthenticated } = useAuth();
  const [activeLoans, setActiveLoans] = useState<any[]>([]);
  const [loanHistory, setLoanHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    nome: user?.nome || "",
    email: user?.email || "",
  });
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [allLoans, setAllLoans] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    }
  }, [isAuthenticated, user]);

  async function loadUserData() {
    setLoading(true);
    try {
      if (user?.tipo === "BIBLIOTECARIO") {
        const todos = await listarTodosEmprestimos();
        setAllLoans(todos);
        setLoading(false);
        return;
      }

      if (user?.tipo === "LEITOR") {
        const [ativos, historico, favs] = await Promise.all([
          meusEmprestimos(user.id),
          historicoLeitor(user.id),
          listarFavoritos(),
        ]);

        setActiveLoans(ativos.filter((l: any) => !l.dataDevolucaoReal));
        setLoanHistory(historico);
        setFavoritos(favs);
      } else {
        setActiveLoans([]);
        setLoanHistory([]);
        setFavoritos([]);
      }
    } catch (error: any) {
      console.error("Erro ao carregar dados do utilizador:", error);
      toast.error("Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRenovation(emprestimoId: number) {
    try {
      await solicitarRenovacao(emprestimoId, user!.id);
      toast.success("Renovação solicitada com sucesso!");
      loadUserData();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleSaveProfile() {
    setIsEditing(false);
    toast.success("Perfil atualizado!");
  }

  if (!isAuthenticated) {
    return (
      <div className="p-8">
        <Card className="text-center py-12">
          <h2>Você precisa estar logado</h2>
          <Link to="/login" className="text-primary mt-4 inline-block">
            Ir para login
          </Link>
        </Card>
      </div>
    );
  }

  if (loading) {
    return <div className="p-8">Carregando seus dados...</div>;
  }

  if (user?.tipo === "BIBLIOTECARIO") {
    return (
      <div className="p-8 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Meu Perfil</h1>
            <p className="text-muted-foreground text-lg">
              Gerencie suas informações e visualize todos os empréstimos do sistema
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card className="p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                {isEditing ? (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold">Editar Perfil</h3>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <Input
                        label="Nome completo"
                        value={profileData.nome}
                        onChange={(e) =>
                          setProfileData({ ...profileData, nome: e.target.value })
                        }
                      />
                      <Input
                        label="E-mail"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({ ...profileData, email: e.target.value })
                        }
                      />
                      <Button className="w-full" onClick={handleSaveProfile}>
                        Salvar Alterações
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 text-white text-4xl shadow-md">
                      {user?.nome
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .substring(0, 2)}
                    </div>
                    <h2 className="text-2xl font-bold mb-1">{user?.nome}</h2>
                    <p className="text-muted-foreground mb-6">{user?.email}</p>
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="w-4 h-4" />
                      <span>Editar Perfil</span>
                    </Button>
                  </>
                )}
              </Card>
            </div>

            {/* Tabela de todos os empréstimos */}
            <div className="lg:col-span-3">
              <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-6">
                  Histórico de Empréstimos do Sistema
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b-2 border-border">
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                          Leitor
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                          Livro
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                          Data Empréstimo
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                          Prev. Devolução
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                          Data Devolução
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allLoans.map((loan) => (
                        <tr
                          key={loan.idEmprestimo}
                          className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                        >
                          <td className="py-3 px-4 font-medium">
                            {loan.leitor?.nome || "N/A"}
                          </td>
                          <td className="py-3 px-4">
                            {loan.exemplar?.obra?.titulo || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {new Date(loan.dataEmprestimo).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {new Date(loan.dataDevolucaoPrevista).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {loan.dataDevolucaoReal
                              ? new Date(loan.dataDevolucaoReal).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={loan.dataDevolucaoReal ? "success" : "warning"}
                              className="px-3 py-1 text-xs font-medium"
                            >
                              {loan.dataDevolucaoReal ? "Devolvido" : "Ativo"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                      {allLoans.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-8 text-muted-foreground"
                          >
                            Nenhum empréstimo registrado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Meu Perfil</h1>
          <p className="text-muted-foreground text-lg">
            Gerencie suas informações e acompanhe seus empréstimos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1 p-6 shadow-sm hover:shadow-md transition-shadow">
            {isEditing ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Editar Perfil</h3>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <Input
                    label="Nome completo"
                    value={profileData.nome}
                    onChange={(e) =>
                      setProfileData({ ...profileData, nome: e.target.value })
                    }
                  />
                  <Input
                    label="E-mail"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                  />
                  <Button className="w-full" onClick={handleSaveProfile}>
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 text-white text-4xl shadow-md">
                  {user?.nome
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .substring(0, 2)}
                </div>
                <h2 className="text-2xl font-bold mb-1">{user?.nome}</h2>
                <p className="text-muted-foreground mb-6">{user?.email}</p>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar Perfil</span>
                </Button>
              </div>
            )}
          </Card>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-primary to-primary/80 text-white border-0 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>
              <p className="text-white/80 mb-1">Empréstimos Ativos</p>
              <h2 className="text-2xl font-bold">{activeLoans.length}</h2>
            </Card>

            <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-accent border-0 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>
              <p className="text-accent/80 mb-1">Livros Devolvidos</p>
              <h2 className="text-2xl font-bold">{loanHistory.length}</h2>
            </Card>

            <Card className="bg-gradient-to-br from-accent to-accent/80 text-white border-0 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <p className="text-white/80 mb-1">Total Empréstimos</p>
              <h2 className="text-2xl font-bold">
                {activeLoans.length + loanHistory.length}
              </h2>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">Empréstimos Ativos</h3>
            </div>
            {activeLoans.length > 0 ? (
              <div className="space-y-4">
                {activeLoans.map((loan) => {
                  const dueDate = new Date(loan.dataDevolucaoPrevista);
                  const today = new Date();
                  const daysLeft = Math.ceil(
                    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                  );
                  const isOverdue = daysLeft < 0;
                  return (
                    <div
                      key={loan.idEmprestimo}
                      className="p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">
                          {loan.exemplar?.obra?.titulo || "Livro"}
                        </h4>
                        <Badge
                          variant={isOverdue ? "error" : daysLeft <= 7 ? "warning" : "success"}
                          className="px-3 py-1 text-xs font-medium"
                        >
                          {isOverdue ? "Atrasado" : `${daysLeft} dias`}
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                        <span>
                          Empréstimo: {new Date(loan.dataEmprestimo).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>
                          Devolução: {new Date(loan.dataDevolucaoPrevista).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRenovation(loan.idEmprestimo)}
                          className="flex items-center justify-center gap-1"
                        >
                          Renovar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                          className="flex items-center justify-center gap-1 opacity-60"
                        >
                          Devolver (balcão)
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Você não possui empréstimos ativos
                </p>
              </div>
            )}
          </Card>

          <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-6">📚 Meus Favoritos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoritos.map((fav) => (
                <Link key={fav.idFavorito} to={`/book/${fav.obra.idObra}`}>
                  <div className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-12 h-16 bg-primary/10 rounded overflow-hidden flex-shrink-0">
                      {fav.obra.urlCapa ? (
                        <img
                          src={fav.obra.urlCapa}
                          className="w-full h-full object-cover"
                          alt={fav.obra.titulo}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          📖
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium truncate">{fav.obra.titulo}</h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {fav.obra.autor}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
              {favoritos.length === 0 && (
                <p className="text-muted-foreground col-span-full text-center py-4">
                  Nenhum livro favoritado ainda.
                </p>
              )}
            </div>
          </Card>

          <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">Histórico de Empréstimos</h3>
            </div>
            {loanHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b-2 border-border">
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                        Livro
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                        Empréstimo
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                        Devolução
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loanHistory.map((loan) => (
                      <tr
                        key={loan.idEmprestimo}
                        className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium">
                          {loan.exemplar?.obra?.titulo || "-"}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(loan.dataEmprestimo).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {loan.dataDevolucaoReal
                            ? new Date(loan.dataDevolucaoReal).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="success" className="px-3 py-1 text-xs font-medium">
                            Devolvido
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Nenhum empréstimo no histórico.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}