import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { useAuth } from "../context/AuthContext";
import {
  obterObra,
  consultarDisponibilidade,
  realizarEmprestimo,
  solicitarReservaLeitor,
  avaliarLivro,
  obterAvaliacoes,
  removerFavorito,
  verificarFavorito,
  adicionarFavorito,
} from "../services/api";
import { ArrowLeft, Calendar, User, Tag, BookOpen, Heart, MapPin, Star } from "lucide-react";
import { toast } from "sonner";

export function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useAuth();
  const [obra, setObra] = useState<any>(null);
  const [disponibilidade, setDisponibilidade] = useState<{ disponivel: boolean; localizacoes: string[] } | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [showReservation, setShowReservation] = useState(false);
  const [isFavorito, setIsFavorito] = useState(false);

  const obraId = Number(id);

  useEffect(() => {
    if (isAuthenticated && obra) {
      verificarFavorito(obra.idObra).then(setIsFavorito);
    }
  }, [isAuthenticated, obra]);

  async function handleToggleFavorito() {
    if (!isAuthenticated) {
      toast.error("Faça login para favoritar livros.");
      navigate("/login");
      return;
    }
    try {
      if (isFavorito) {
        await removerFavorito(obra.idObra);
        toast.success("Removido dos favoritos");
      } else {
        await adicionarFavorito(obra.idObra);
        toast.success("Adicionado aos favoritos");
      }
      setIsFavorito(!isFavorito);
    } catch (error) {
      toast.error("Erro ao alterar favorito");
    }
  }

  useEffect(() => {
    loadBookData();
  }, [obraId]);

  async function loadBookData() {
    setLoading(true);
    try {
      const [obraData, dispData, avalData] = await Promise.all([
        obterObra(obraId),
        consultarDisponibilidade(obraId),
        obterAvaliacoes(obraId),
      ]);
      setObra(obraData);
      setDisponibilidade(dispData);
      setAvaliacoes(avalData);
    } catch (error) {
      console.error("Erro ao carregar livro:", error);
      toast.error("Não foi possível carregar os dados do livro.");
    } finally {
      setLoading(false);
    }
  }

  async function handleBorrow() {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para emprestar um livro.");
      navigate("/login");
      return;
    }
    try {
      toast.error("Funcionalidade em desenvolvimento: peça ao bibliotecário para realizar o empréstimo.");
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleReserve() {
    if (!isAuthenticated) {
      toast.error("Faça login para reservar.");
      navigate("/login");
      return;
    }
    try {
      await solicitarReservaLeitor(obraId);
      toast.success("Reserva solicitada! Você será notificado quando o livro estiver disponível.");
      setShowReservation(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleAvaliar() {
    if (!isAuthenticated) {
      toast.error("Faça login para avaliar.");
      return;
    }
    if (userRating === 0) {
      toast.error("Selecione uma nota antes de enviar.");
      return;
    }
    try {
      await avaliarLivro(obraId, userRating, userComment);
      toast.success("Avaliação enviada com sucesso!");
      setUserRating(0);
      setUserComment("");
      loadBookData(); 
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!obra) {
    return (
      <div className="p-8">
        <Card className="text-center py-12">
          <h2>Livro não encontrado</h2>
          <Link to="/catalog" className="text-primary mt-4 inline-block">
            Voltar ao catálogo
          </Link>
        </Card>
      </div>
    );
  }

  const mediaAvaliacoes =
    avaliacoes.length > 0
      ? avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length
      : 0;

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/catalog" className="inline-flex items-center gap-2 text-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {obra.urlCapa ? (
                  <img src={obra.urlCapa} alt={obra.titulo} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-9xl">📚</span>
                )}
              </div>
              <Badge
                variant={disponibilidade?.disponivel ? "success" : "warning"}
                className="w-full justify-center py-2 mb-4"
              >
                {disponibilidade?.disponivel ? "✓ Disponível" : "⏱ Indisponível"}
              </Badge>
              {disponibilidade?.disponivel ? (
                <Button className="w-full mb-3" onClick={handleBorrow}>
                  Emprestar Livro
                </Button>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    className="w-full mb-3"
                    onClick={() => setShowReservation(!showReservation)}
                  >
                    Reservar Livro
                  </Button>
                  {showReservation && (
                    <div className="mb-3 p-3 bg-secondary/10 rounded-lg">
                      <p className="text-sm mb-2">
                        Você será notificado quando o livro estiver disponível.
                      </p>
                      <Button size="sm" variant="secondary" className="w-full" onClick={handleReserve}>
                        Confirmar Reserva
                      </Button>
                    </div>
                  )}
                </>
              )}

              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={handleToggleFavorito}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorito ? "fill-destructive text-destructive" : ""}`} />
                {isFavorito ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
              </Button>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <h1 className="mb-3">{obra.titulo}</h1>

              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.floor(mediaAvaliacoes)
                          ? "fill-secondary text-secondary"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {mediaAvaliacoes.toFixed(1)} ({avaliacoes.length} avaliações)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b">
                <div className="flex gap-3">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Autor</p>
                    <p className="font-medium">{obra.autor}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Calendar className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ano</p>
                    <p className="font-medium">{obra.anoPublicacao}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Tag className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Editora</p>
                    <p className="font-medium">{obra.editora || "Não informada"}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">ISBN</p>
                    <p className="font-medium">{obra.isbn}</p>
                  </div>
                </div>
                {disponibilidade?.localizacoes && disponibilidade.localizacoes.length > 0 && (
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Localização</p>
                      <p className="font-medium">{disponibilidade.localizacoes.join(", ")}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="mb-3">Sinopse</h3>
                <p className="text-foreground/80 leading-relaxed">{obra.sinopse || "Sem sinopse disponível."}</p>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="mb-4">Avalie este livro</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        onClick={() => setUserRating(star)}
                        className={`w-8 h-8 cursor-pointer ${
                          star <= userRating
                            ? "fill-secondary text-secondary"
                            : "text-gray-300 hover:text-secondary/50"
                        }`}
                      />
                    ))}
                  </div>
                  {userRating > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Você deu {userRating} estrela{userRating > 1 ? "s" : ""}
                    </p>
                  )}
                </div>
                <textarea
                  className="w-full px-4 py-2 rounded-lg border border-border min-h-[100px] mb-4"
                  placeholder="Escreva sua avaliação (opcional)"
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                />
                <Button onClick={handleAvaliar} disabled={userRating === 0}>
                  Enviar Avaliação
                </Button>
              </div>

              {avaliacoes.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="mb-4">Comentários dos Leitores</h3>
                  <div className="space-y-4">
                    {avaliacoes.map((aval) => (
                      <div key={aval.idAvaliacao} className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-4 h-4 ${
                                  s <= aval.nota ? "fill-secondary text-secondary" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{aval.leitor?.nome || "Anônimo"}</span>
                        </div>
                        {aval.comentario && <p className="text-sm">{aval.comentario}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}