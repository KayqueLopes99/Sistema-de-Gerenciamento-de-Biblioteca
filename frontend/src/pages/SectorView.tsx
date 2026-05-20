import { useParams, Link } from "react-router";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { books } from "../data/mockData";
import { useLibrary } from "../context/LibraryContext";
import { ArrowLeft, Star } from "lucide-react";

const sectorInfo: Record<string, { name: string; description: string; color: string }> = {
  A: {
    name: "Setor A - Clássicos Brasileiros (Século XIX)",
    description: "Obras fundamentais da literatura brasileira do século XIX",
    color: "from-primary/20 to-primary/5",
  },
  B: {
    name: "Setor B - Literatura Brasileira Moderna",
    description: "Literatura brasileira do início do século XX",
    color: "from-secondary/20 to-secondary/5",
  },
  C: {
    name: "Setor C - Romantismo e Indianismo",
    description: "Movimento romântico e obras indianistas",
    color: "from-accent/20 to-accent/5",
  },
  D: {
    name: "Setor D - Modernismo e Contemporâneos",
    description: "Modernismo brasileiro e literatura contemporânea",
    color: "from-destructive/20 to-destructive/5",
  },
};

export function SectorView() {
  const { sector } = useParams();
  const { isBookLoaned } = useLibrary();
  const info = sector ? sectorInfo[sector.toUpperCase()] : null;
  const sectorBooks = books.filter((book) => book.location?.sector === sector?.toUpperCase());

  if (!info || !sector) {
    return (
      <div className="p-8">
        <Card className="text-center py-12">
          <h2>Setor não encontrado</h2>
          <Link to="/map" className="text-primary hover:text-primary/80 mt-4 inline-block">
            Voltar ao Mapa
          </Link>
        </Card>
      </div>
    );
  }

  const shelves = Array.from(new Set(sectorBooks.map((b) => b.location?.shelf))).sort();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/map"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Mapa
        </Link>

        <Card className={`mb-8 bg-gradient-to-r ${info.color} border-primary/20`}>
          <div className="flex items-center gap-6">
            <div className="text-7xl">📚</div>
            <div className="flex-1">
              <h1 className="mb-2">{info.name}</h1>
              <p className="text-muted-foreground mb-4">{info.description}</p>
              <Badge variant="default" className="text-sm">
                {sectorBooks.length} livros neste setor
              </Badge>
            </div>
          </div>
        </Card>

        {shelves.map((shelf) => {
          const shelfBooks = sectorBooks.filter((b) => b.location?.shelf === shelf);
          return (
            <Card key={shelf} className="mb-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div>
                  <h2>Prateleira {shelf}</h2>
                  <p className="text-sm text-muted-foreground">
                    {shelfBooks.length} {shelfBooks.length === 1 ? "livro" : "livros"}
                  </p>
                </div>
                <div className="text-5xl">📖</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {shelfBooks.map((book) => {
                  const loaned = isBookLoaned(book.id);
                  return (
                    <Link key={book.id} to={`/book/${book.id}`}>
                      <div className="bg-muted/30 rounded-lg p-4 border border-border hover:bg-muted/50 hover:shadow-md transition-all h-full flex flex-col">
                        <div className="aspect-[2/3] bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                          {book.cover ? (
                            <img
                              src={book.cover}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-5xl">📚</span>
                          )}
                        </div>
                        <h4 className="mb-2 line-clamp-2 flex-1">{book.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                        {book.rating && (
                          <div className="flex items-center gap-1 mb-3">
                            <Star className="w-4 h-4 fill-secondary text-secondary" />
                            <span className="text-sm font-medium">{book.rating.toFixed(1)}</span>
                            <span className="text-xs text-muted-foreground">({book.reviews})</span>
                          </div>
                        )}
                        <Badge variant={loaned ? "warning" : "success"} className="w-full justify-center">
                          {loaned ? "Emprestado" : "Disponível"}
                        </Badge>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
