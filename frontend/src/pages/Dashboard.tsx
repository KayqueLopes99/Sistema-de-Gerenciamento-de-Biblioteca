import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card } from "../components/Card";
import { BookCard } from "../components/BookCard";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { buscarObras, meusEmprestimos, listarLeitores, buscarRecomendados } from "../services/api";
import { BookOpen, Clock, TrendingUp, Users } from "lucide-react";

export function Dashboard() {
  const { user, isAuthenticated, isBibliotecario } = useAuth();
  const [totalBooks, setTotalBooks] = useState(0);
  const [activeLoansCount, setActiveLoansCount] = useState(0);
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    buscarRecomendados().then(setRecommendations).catch(console.error);
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const allBooks = await buscarObras();
      setTotalBooks(allBooks.length);
      setRecommendations(allBooks.slice(0, 4));

      if (isBibliotecario) {
        try {
          const leitores = await listarLeitores();
          const ativos = leitores.filter((l: any) => l.statusLeitor === "ATIVO");
          setActiveUsersCount(ativos.length);
        } catch (err) {
          console.warn("Não foi possível carregar leitores ativos", err);
          setActiveUsersCount(0);
        }
      }

      if (isAuthenticated && user) {
        const loans = await meusEmprestimos(user.id);
        const activeLoans = loans.filter((l: any) => !l.dataDevolucaoReal);
        setActiveLoansCount(activeLoans.length);
      }
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2">
            Bem-vindo{user ? `, ${user.nome.split(" ")[0]}` : ""} à BiblioTech
          </h1>
          <p className="text-muted-foreground">
            Explore nosso acervo e descubra sua próxima leitura
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-white border-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 mb-1">Livros no Acervo</p>
                <h2 className="text-white">{totalBooks}</h2>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-accent border-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-accent/80 mb-1">Meus Empréstimos</p>
                <h2 className="text-accent">{activeLoansCount}</h2>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-accent to-accent/80 text-white border-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 mb-1">Total de Livros</p>
                <h2 className="text-white">{totalBooks}</h2>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </Card>

          {isBibliotecario && (
            <Card className="bg-gradient-to-br from-primary/60 to-accent/60 text-white border-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/80 mb-1">Usuários Ativos</p>
                  <h2 className="text-white">{activeUsersCount}</h2>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="mb-1">Recomendações para Você</h2>
              <p className="text-muted-foreground">
                Livros selecionados especialmente para você
              </p>
            </div>
            <Link to="/catalog">
              <Button variant="outline">Ver Catálogo Completo</Button>
            </Link>
          </div>

          {loading ? (
            <p>Carregando recomendações...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((book: any) => (
                <BookCard
                  key={book.idObra}
                  book={{
                    id: book.idObra,
                    title: book.titulo,
                    author: book.autor,
                    year: book.anoPublicacao,
                    cover: book.urlCapa,
                    available: true,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <div className="flex items-center gap-6">
              <div className="text-6xl">📖</div>
              <div className="flex-1">
                <h3 className="mb-2">Explore Novos Horizontes</h3>
                <p className="text-muted-foreground mb-4">
                  Descubra clássicos da literatura brasileira e mundial
                </p>
                <Link to="/catalog">
                  <Button>Explorar Catálogo</Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-secondary/10 to-primary/10 border-secondary/20">
            <div className="flex items-center gap-6">
              <div className="text-6xl">🗺️</div>
              <div className="flex-1">
                <h3 className="mb-2">Encontre seu Livro</h3>
                <p className="text-muted-foreground mb-4">
                  Use o mapa interativo para localizar livros na biblioteca
                </p>
                <Link to="/map">
                  <Button variant="secondary">Ver Mapa</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}