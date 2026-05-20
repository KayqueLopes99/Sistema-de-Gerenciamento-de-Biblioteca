import { useState } from "react";
import { Link } from "react-router";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { books } from "../data/mockData";
import { Search, MapPin, Book as BookIcon, ExternalLink } from "lucide-react";

interface Sector {
  id: string;
  name: string;
  description: string;
  color: string;
  position: { top: string; left: string };
  size: { width: string; height: string };
}

const sectors: Sector[] = [
  {
    id: "A",
    name: "Setor A",
    description: "Clássicos Brasileiros (Século XIX)",
    color: "bg-primary/20 border-primary hover:bg-primary/30",
    position: { top: "20%", left: "8%" },
    size: { width: "40%", height: "30%" },
  },
  {
    id: "B",
    name: "Setor B",
    description: "Literatura Brasileira Moderna",
    color: "bg-secondary/20 border-secondary hover:bg-secondary/30",
    position: { top: "20%", left: "52%" },
    size: { width: "40%", height: "30%" },
  },
  {
    id: "C",
    name: "Setor C",
    description: "Romantismo e Indianismo",
    color: "bg-accent/20 border-accent hover:bg-accent/30",
    position: { top: "55%", left: "8%" },
    size: { width: "40%", height: "30%" },
  },
  {
    id: "D",
    name: "Setor D",
    description: "Modernismo e Contemporâneos",
    color: "bg-destructive/20 border-destructive hover:bg-destructive/30",
    position: { top: "55%", left: "52%" },
    size: { width: "40%", height: "30%" },
  },
];

export function LibraryMap() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [highlightedBook, setHighlightedBook] = useState<number | null>(null);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      const foundBook = books.find((book) =>
        book.title.toLowerCase().includes(term.toLowerCase())
      );
      if (foundBook && foundBook.location) {
        setSelectedSector(foundBook.location.sector);
        setHighlightedBook(foundBook.id);
      }
    } else {
      setSelectedSector(null);
      setHighlightedBook(null);
    }
  };

  const booksInSector = (sectorId: string) =>
    books.filter((book) => book.location?.sector === sectorId);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2">Mapa da Biblioteca</h1>
          <p className="text-muted-foreground">
            Localize livros e navegue pelos setores da biblioteca
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar livro por título..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              {highlightedBook && (
                <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm">
                    <MapPin className="inline w-4 h-4 mr-2 text-primary" />
                    Livro localizado no{" "}
                    <span className="font-medium">
                      Setor {books.find((b) => b.id === highlightedBook)?.location?.sector} -{" "}
                      Prateleira {books.find((b) => b.id === highlightedBook)?.location?.shelf}
                    </span>
                  </p>
                </div>
              )}
            </Card>

            <Card className="p-0 overflow-hidden">
              <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
                <h3>Planta da Biblioteca</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Clique em um setor para explorar suas prateleiras
                </p>
              </div>
              <div className="relative bg-gradient-to-br from-background via-muted/20 to-background aspect-[4/3] p-8">
                {/* Entrada */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                  <div className="w-32 h-3 bg-primary/30 rounded-full"></div>
                  <p className="text-xs font-medium bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    🚪 Entrada Principal
                  </p>
                </div>

                {/* Balcão Central */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-muted rounded-lg border-2 border-border flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🏢</div>
                    <p className="text-xs font-medium">Atendimento</p>
                  </div>
                </div>

                {/* Setores */}
                {sectors.map((sector) => (
                  <div
                    key={sector.id}
                    className={`absolute border-2 rounded-lg cursor-pointer transition-all ${
                      sector.color
                    } ${
                      selectedSector === sector.id
                        ? "ring-4 ring-ring/30 shadow-2xl z-10"
                        : "shadow-md"
                    }`}
                    style={{
                      top: sector.position.top,
                      left: sector.position.left,
                      width: sector.size.width,
                      height: sector.size.height,
                    }}
                  >
                    <div
                      onClick={() => setSelectedSector(sector.id)}
                      className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
                    >
                      {/* Prateleiras decorativas */}
                      <div className="absolute inset-4 grid grid-cols-3 gap-1 opacity-20">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className="bg-foreground rounded-sm"></div>
                        ))}
                      </div>

                      <div className="relative z-10">
                        <div className="text-5xl mb-3">📚</div>
                        <h4 className="mb-1 bg-background/80 px-2 py-1 rounded">{sector.name}</h4>
                        <p className="text-xs text-muted-foreground mb-3 bg-background/80 px-2 py-1 rounded">
                          {sector.description}
                        </p>
                        <Badge variant="default" className="bg-background/90">
                          {booksInSector(sector.id).length} livros
                        </Badge>
                      </div>
                    </div>

                    <Link
                      to={`/sector/${sector.id}`}
                      className="absolute top-2 right-2 p-2 bg-background/90 rounded-lg hover:bg-background transition-colors shadow-sm border border-border"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                ))}

                {/* Área de Leitura */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-secondary/30 rounded-full"></div>
                    <div className="w-8 h-8 bg-secondary/30 rounded-full"></div>
                    <div className="w-8 h-8 bg-secondary/30 rounded-full"></div>
                  </div>
                  <p className="text-xs font-medium bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                    ☕ Área de Leitura
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <BookIcon className="w-5 h-5 text-primary" />
                <h3>
                  {selectedSector
                    ? `Setor ${selectedSector}`
                    : "Todos os Setores"}
                </h3>
              </div>

              {selectedSector ? (
                <div>
                  <div className="mb-4 p-4 bg-muted/50 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground mb-3">
                      {sectors.find((s) => s.id === selectedSector)?.description}
                    </p>
                    <Link to={`/sector/${selectedSector}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Explorar Prateleiras
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {booksInSector(selectedSector).map((book) => (
                      <div
                        key={book.id}
                        className={`p-3 rounded-lg border transition-all ${
                          highlightedBook === book.id
                            ? "bg-primary/10 border-primary shadow-md"
                            : "bg-muted/30 border-border hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="w-12 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded flex-shrink-0 overflow-hidden">
                            {book.cover && (
                              <img
                                src={book.cover}
                                alt={book.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium mb-1 line-clamp-1">
                              {book.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mb-2">
                              {book.author}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="default" className="text-xs">
                                Prateleira {book.location?.shelf}
                              </Badge>
                              <Badge
                                variant={book.available ? "success" : "warning"}
                                className="text-xs"
                              >
                                {book.available ? "Disponível" : "Emprestado"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Selecione um setor no mapa para ver os livros disponíveis
                  </p>
                  <div className="space-y-3">
                    {sectors.map((sector) => (
                      <div
                        key={sector.id}
                        onClick={() => setSelectedSector(sector.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${sector.color} hover:shadow-md`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4>{sector.name}</h4>
                          <Badge variant="default">
                            {booksInSector(sector.id).length}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {sector.description}
                        </p>
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
