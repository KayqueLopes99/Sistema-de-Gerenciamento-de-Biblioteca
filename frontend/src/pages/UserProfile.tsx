import { useState, useEffect } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Input } from "../components/Input";
import { useAuth } from "../context/AuthContext";
import { meusEmprestimos, historicoLeitor, solicitarRenovacao, listarFavoritos } from "../services/api";
import { User, Mail, Calendar, BookOpen, Clock, CheckCircle, Edit, X } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router";

export function UserProfile() {
  const { user, token, isAuthenticated } = useAuth();
  const [activeLoans, setActiveLoans] = useState<any[]>([]);
  const [loanHistory, setLoanHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    nome: user?.nome || "",
    email: user?.email || "",
  });
  const [favoritos, setFavoritos] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    }
  }, [isAuthenticated, user]);

  async function loadUserData() {
    setLoading(true);
    try {
      const [ativos, historico, favs] = await Promise.all([
        meusEmprestimos(user!.id),
        historicoLeitor(user!.id),
        listarFavoritos(),
      ]);
      setActiveLoans(ativos.filter((l: any) => !l.dataDevolucaoReal));
      setLoanHistory(historico);
      setFavoritos(favs);
    } catch (error: any) {
      console.error("Erro ao carregar dados do usuário:", error);
      toast.error("Não foi possível carregar seus dados.");
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
    toast.success("Perfil atualizado (funcionalidade em desenvolvimento completo)");
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

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações e acompanhe seus empréstimos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1">
            {isEditing ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3>Editar Perfil</h3>
                  <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-muted rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <Input
                    label="Nome completo"
                    value={profileData.nome}
                    onChange={(e) => setProfileData({ ...profileData, nome: e.target.value })}
                  />
                  <Input
                    label="E-mail"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                  <Button className="w-full" onClick={handleSaveProfile}>
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 text-white text-4xl">
                  {user?.nome?.split(" ").map((n: string) => n[0]).join("").substring(0, 2)}
                </div>
                <h2 className="mb-1">{user?.nome}</h2>
                <p className="text-muted-foreground mb-4">{user?.email}</p>
                <Button variant="outline" className="w-full mb-3" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
                <Button variant="outline" className="w-full">
                  Alterar Senha
                </Button>
              </div>
            )}
          </Card>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-primary to-primary/80 text-white border-0">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>
              <p className="text-white/80 mb-1">Empréstimos Ativos</p>
              <h2 className="text-white">{activeLoans.length}</h2>
            </Card>

            <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-accent border-0">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>
              <p className="text-accent/80 mb-1">Livros Devolvidos</p>
              <h2 className="text-accent">{loanHistory.length}</h2>
            </Card>

            <Card className="bg-gradient-to-br from-accent to-accent/80 text-white border-0">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <p className="text-white/80 mb-1">Total Empréstimos</p>
              <h2 className="text-white">{activeLoans.length + loanHistory.length}</h2>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-primary" />
              <h3>Empréstimos Ativos</h3>
            </div>
            {activeLoans.length > 0 ? (
              <div className="space-y-4">
                {activeLoans.map((loan) => {
                  const dueDate = new Date(loan.dataDevolucaoPrevista);
                  const today = new Date();
                  const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  const isOverdue = daysLeft < 0;
                  return (
                    <div key={loan.idEmprestimo} className="p-4 bg-muted/30 rounded-lg border">
                      <div className="flex justify-between items-start mb-2">
                        <h4>{loan.exemplar?.obra?.titulo || "Livro"}</h4>
                        <Badge variant={isOverdue ? "error" : daysLeft <= 7 ? "warning" : "success"}>
                          {isOverdue ? "Atrasado" : `${daysLeft} dias`}
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                        <span>Empréstimo: {new Date(loan.dataEmprestimo).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Devolução: {new Date(loan.dataDevolucaoPrevista).toLocaleDateString()}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleRenovation(loan.idEmprestimo)}>
                          Renovar
                        </Button>
                        <Button size="sm" variant="outline" disabled>
                          Devolver (balcão)
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Você não possui empréstimos ativos</p>
              </div>
            )}
          </Card>

          <Card>
            <h3>📚 Meus Favoritos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {favoritos.map((fav) => (
                <Link key={fav.idFavorito} to={`/book/${fav.obra.idObra}`}>
                  <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50">
                    <div className="w-12 h-16 bg-primary/10 rounded overflow-hidden">
                      {fav.obra.urlCapa ? <img src={fav.obra.urlCapa} className="w-full h-full object-cover" /> : "📖"}
                    </div>
                    <div>
                      <h4>{fav.obra.titulo}</h4>
                      <p className="text-sm text-muted-foreground">{fav.obra.autor}</p>
                    </div>
                  </div>
                </Link>
              ))}
              {favoritos.length === 0 && <p className="text-muted-foreground">Nenhum livro favoritado ainda.</p>}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-5 h-5 text-primary" />
              <h3>Histórico de Empréstimos</h3>
            </div>
            {loanHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Livro</th>
                      <th className="text-left py-3 px-4">Empréstimo</th>
                      <th className="text-left py-3 px-4">Devolução</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loanHistory.map((loan) => (
                      <tr key={loan.idEmprestimo} className="border-b">
                        <td className="py-3 px-4">{loan.exemplar?.obra?.titulo || "-"}</td>
                        <td className="py-3 px-4">{new Date(loan.dataEmprestimo).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          {loan.dataDevolucaoReal ? new Date(loan.dataDevolucaoReal).toLocaleDateString() : "-"}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="success">Devolvido</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum empréstimo no histórico.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}