import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { books } from "../data/mockData";
import { useLibrary } from "../context/LibraryContext";
import { ArrowLeft, Calendar, User, Tag, BookOpen, Heart, MapPin, Star } from "lucide-react";
import { toast } from "sonner";

export function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = books.find((b) => b.id === Number(id));
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showReservation, setShowReservation] = useState(false);

  const {
    addLoan,
    toggleFavorite,
    isFavorite,
    isBookLoaned,
    addReview,
    getBookReviews
  } = useLibrary();

  const handleBorrow = () => {
    if (book) {
      addLoan(book.id, book.title);
      toast.success("Livro emprestado com sucesso!", {
        description: `Devolução prevista para ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")}`,
      });
      navigate("/profile");
    }
  };

  const handleToggleFavorite = () => {
    if (book) {
      toggleFavorite(book.id);
      toast.success(
        isFavorite(book.id)
          ? "Removido dos favoritos"
          : "Adicionado aos favoritos!"
      );
    }
  };

  const bookIsLoaned = book ? isBookLoaned(book.id) : false;
  const reviews = book
    ? getBookReviews(book.id)
    : [];
    
  const handleReviewSubmit = () => {
    if (!book) return;
    
    if (!bookIsLoaned) {
      toast.error(
        "Você precisa ter emprestado este livro para avaliá-lo."
      );
      return;
    }
    
    addReview(
      book.id,
      userRating,
      comment
    );
    
    toast.success("Avaliação enviada!");
      setUserRating(0);
      setComment("");
    };

  if (!book) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="mb-2">Livro não encontrado</h2>
            <p className="text-muted-foreground mb-6">
              O livro que você procura não existe ou foi removido
            </p>
            <Link to="/catalog">
              <Button>Voltar ao Catálogo</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {book.cover ? (
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-9xl">📚</span>
                )}
              </div>
              <Badge variant={bookIsLoaned ? "warning" : "success"} className="w-full justify-center py-2 mb-4">
                {bookIsLoaned ? "⏱ Você emprestou este livro" : "✓ Disponível para Empréstimo"}
              </Badge>
              {!bookIsLoaned ? (
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
                    <div className="mb-3 p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                      <p className="text-sm mb-2">
                        Você será notificado quando o livro estiver disponível
                      </p>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-full"
                        onClick={() => {
                          toast.success("Reserva confirmada!");
                          setShowReservation(false);
                        }}
                      >
                        Confirmar Reserva
                      </Button>
                    </div>
                  )}
                </>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={handleToggleFavorite}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorite(book.id) ? "fill-destructive text-destructive" : ""}`} />
                {isFavorite(book.id) ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
              </Button>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <h1 className="mb-3">{book.title}</h1>

              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.floor(book.rating || 0)
                          ? "fill-secondary text-secondary"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {book.rating?.toFixed(1)} ({book.reviews} avaliações)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Autor</p>
                    <p className="font-medium">{book.author}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ano de Publicação</p>
                    <p className="font-medium">{book.year}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Tag className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gênero</p>
                    <p className="font-medium">{book.genre}</p>
                  </div>
                </div>

                {book.isbn && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ISBN</p>
                      <p className="font-medium">{book.isbn}</p>
                    </div>
                  </div>
                )}

                {book.location && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Localização</p>
                      <p className="font-medium mb-1">
                        Setor {book.location.sector} - Prateleira {book.location.shelf}
                      </p>
                      <Link to="/map" className="text-xs text-primary hover:text-primary/80 transition-colors">
                        Ver no mapa →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="mb-3">Sobre o Livro</h3>
                <p className="text-foreground/80 leading-relaxed">{book.description}</p>
              </div>
            </Card>

            <Card className="mt-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/10">
              <h3 className="mb-4">Informações de Empréstimo</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Exemplares</p>
                  <p className="font-medium">{book.copies || 1} unidade{(book.copies || 1) > 1 ? "s" : ""}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Prazo de Empréstimo</p>
                  <p className="font-medium">30 dias</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Renovações Permitidas</p>
                  <p className="font-medium">Até 2 vezes</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Multa por Atraso</p>
                  <p className="font-medium">R$ 0,50/dia</p>
                </div>
              </div>
            </Card>

            <Card className="mt-6">
              <h3 className="mb-4">Avalie este Livro</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      onClick={() => setUserRating(star)}
                      className={`w-8 h-8 cursor-pointer transition-all ${
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
               value={comment}
               onChange={(e) =>
                 setComment(e.target.value)
               }
              />
              <Button 
                disabled={userRating === 0}
                onClick={handleReviewSubmit}
                >Enviar Avaliação</Button>

              <div className="mt-8">
                <h3 className="mb-4">
                  Avaliações dos Leitores
                </h3>

                {reviews.length === 0 ? (
                  <p className="text-muted-foreground">
                    Nenhuma avaliação ainda.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border border-border rounded-lg p-4"
                      >
                        <div className="flex justify-between mb-2">
                          <strong>
                            {review.userName}
                          </strong>

                          <div className="flex">
                            {[1,2,3,4,5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? "fill-secondary text-secondary"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <p>{review.comment}</p>

                        <small className="text-muted-foreground">
                          {new Date(
                            review.createdAt
                          ).toLocaleDateString("pt-BR")}
                        </small>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
