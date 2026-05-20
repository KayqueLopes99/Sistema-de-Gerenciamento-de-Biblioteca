import { useState } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Input } from "../components/Input";
import { books } from "../data/mockData";
import { useLibrary } from "../context/LibraryContext";
import { User, Mail, Calendar, Heart, BookOpen, Clock, CheckCircle, Edit, X } from "lucide-react";
import { toast } from "sonner";

export function UserProfile() {
  const { loans, favorites, renewLoan, returnBook } = useLibrary();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Maria Clara Silva",
    email: "maria.silva@email.com",
  });

  const activeLoans = loans.filter((l) => !l.returnDate);
  const loanHistory = loans.filter((l) => l.returnDate);
  const favoriteBooks = books.filter((b) => favorites.includes(b.id));

  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    toast.success("Perfil atualizado com sucesso!");
  };

  const handleRenewLoan = (loanId: number) => {
    renewLoan(loanId);
    toast.success("Empréstimo renovado por mais 30 dias!");
  };

  const handleReturnBook = (loanId: number) => {
    returnBook(loanId);
    toast.success("Livro devolvido com sucesso!");
  };

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
            {isEditingProfile ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3>Editar Perfil</h3>
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <Input
                    label="Nome completo"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
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
                  {profileData.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <h2 className="mb-1">{profileData.name}</h2>
                <p className="text-muted-foreground mb-4">{profileData.email}</p>
                <Button
                  variant="outline"
                  className="w-full mb-3"
                  onClick={() => setIsEditingProfile(true)}
                >
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
                  <Heart className="w-5 h-5" />
                </div>
              </div>
              <p className="text-white/80 mb-1">Favoritos</p>
              <h2 className="text-white">{favoriteBooks.length}</h2>
            </Card>

            <Card className="md:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium">{profileData.name.split(' ')[0]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Membro desde</p>
                    <p className="font-medium">Janeiro 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant="success">Ativo</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-primary" />
              <h3>Empréstimos Ativos</h3>
            </div>

            {activeLoans.length > 0 ? (
              <div className="space-y-4">
                {activeLoans.map((loan) => {
                  const daysLeft = Math.ceil(
                    (new Date(loan.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );
                  const isOverdue = daysLeft < 0;

                  return (
                    <div
                      key={loan.id}
                      className="p-4 bg-muted/30 rounded-lg border border-border"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="flex-1">{loan.bookTitle}</h4>
                        <Badge variant={isOverdue ? "error" : daysLeft <= 7 ? "warning" : "success"}>
                          {isOverdue ? "Atrasado" : `${daysLeft} dias`}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span>Empréstimo: {new Date(loan.loanDate).toLocaleDateString("pt-BR")}</span>
                        <span>•</span>
                        <span>Devolução: {new Date(loan.dueDate).toLocaleDateString("pt-BR")}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRenewLoan(loan.id)}
                        >
                          Renovar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReturnBook(loan.id)}
                        >
                          Devolver
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📚</div>
                <p className="text-muted-foreground">Você não possui empréstimos ativos</p>
              </div>
            )}
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-5 h-5 text-destructive" />
              <h3>Livros Favoritos</h3>
            </div>

            <div className="space-y-4">
              {favoriteBooks.map((book) => (
                <div
                  key={book.id}
                  className="p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="flex-1">{book.title}</h4>
                    <Badge variant={book.available ? "success" : "warning"}>
                      {book.available ? "Disponível" : "Emprestado"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{book.author}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => window.location.href = `/book/${book.id}`}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-5 h-5 text-primary" />
            <h3>Histórico de Empréstimos</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Livro</th>
                  <th className="text-left py-3 px-4">Empréstimo</th>
                  <th className="text-left py-3 px-4">Devolução</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {loanHistory.map((loan) => (
                  <tr key={loan.id} className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">{loan.bookTitle}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(loan.loanDate).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {loan.returnDate && new Date(loan.returnDate).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="success">Devolvido</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
