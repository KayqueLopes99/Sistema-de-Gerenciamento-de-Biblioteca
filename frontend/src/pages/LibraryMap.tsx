import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { listarExemplares, listarLocalizacoes, buscarObras } from "../services/api";
import { Search, MapPin, Book as BookIcon, ExternalLink } from "lucide-react";

interface Sector {
  id: string;
  name: string;
  description: string;
  color: string;
  position: { top: string; left: string };
  size: { width: string; height: string };
}

interface ExemplarCompleto {
  idExemplar: number;
  codigoBarras: string;
  status: string;
  idLocalizacao?: number;
  localizacao?: { sala: string; estante: string; sessao: string };
  obra: { idObra: number; titulo: string; autor: string; urlCapa?: string };
}

const getDefaultSectorPositions = (sectorNames: string[]): Sector[] => {
  const positions = [
    { top: "20%", left: "8%" },
    { top: "20%", left: "52%" },
    { top: "55%", left: "8%" },
    { top: "55%", left: "52%" },
  ];
  return sectorNames.slice(0, 4).map((name, idx) => ({
    id: name,
    name: `Setor ${name}`,
    description: `Livros da sessão "${name}"`,
    color: "bg-primary/20 border-primary hover:bg-primary/30",
    position: positions[idx % positions.length],
    size: { width: "40%", height: "30%" },
  }));
};

export function LibraryMap() {
  const [exemplares, setExemplares] = useState<ExemplarCompleto[]>([]);
  const [obras, setObras] = useState<any[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [highlightedBook, setHighlightedBook] = useState<number | null>(null);
  const [filteredExemplares, setFilteredExemplares] = useState<ExemplarCompleto[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [exemplaresRaw, obrasData, locsData] = await Promise.all([
        listarExemplares(),
        buscarObras(),
        listarLocalizacoes(),
      ]);

      const exemplaresCompletos: ExemplarCompleto[] = exemplaresRaw.map((ex: any) => ({
        ...ex,
        localizacao: ex.localizacao || undefined,
      }));
      setExemplares(exemplaresCompletos);
      setObras(obrasData);

      const uniqueSessao = new Set<string>();
      exemplaresCompletos.forEach(ex => {
        if (ex.localizacao?.sessao) uniqueSessao.add(ex.localizacao.sessao);
      });
      locsData.forEach((loc: any) => {
        if (loc.sessao) uniqueSessao.add(loc.sessao);
      });
      const sectorNames = uniqueSessao.size ? Array.from(uniqueSessao) : ["Geral"];
      setSectors(getDefaultSectorPositions(sectorNames));

      setFilteredExemplares(exemplaresCompletos);
    } catch (error) {
      console.error("Erro ao carregar dados do mapa:", error);
    } finally {
      setLoading(false);
    }
  }

  function updateFilteredExemplares(sector: string | null, term: string) {
    let filtered = exemplares;
    if (sector) {
      filtered = filtered.filter(ex => ex.localizacao?.sessao === sector);
    }
    if (term.trim() !== "") {
      const lowerTerm = term.toLowerCase();
      filtered = filtered.filter(ex => 
        ex.obra.titulo.toLowerCase().includes(lowerTerm) ||
        ex.obra.autor.toLowerCase().includes(lowerTerm)
      );
    }
    setFilteredExemplares(filtered);
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setHighlightedBook(null);
      updateFilteredExemplares(selectedSector, "");
      return;
    }
    const foundObra = obras.find(obra =>
      obra.titulo.toLowerCase().includes(term.toLowerCase())
    );
    if (foundObra) {
      const exemplar = exemplares.find(ex => ex.obra.idObra === foundObra.idObra && ex.localizacao);
      if (exemplar && exemplar.localizacao?.sessao) {
        setSelectedSector(exemplar.localizacao.sessao);
        setHighlightedBook(exemplar.idExemplar);
        updateFilteredExemplares(exemplar.localizacao.sessao, term);
        return;
      }
    }
    setHighlightedBook(null);
    updateFilteredExemplares(selectedSector, term);
  };

  const handleSectorClick = (sectorId: string) => {
    setSelectedSector(sectorId);
    setHighlightedBook(null);
    setSearchTerm("");
    updateFilteredExemplares(sectorId, "");
  };

  const exemplaresPorSessao = (sessao: string) => {
    return exemplares.filter(ex => ex.localizacao?.sessao === sessao);
  };

  const getExemplarById = (id: number) => exemplares.find(ex => ex.idExemplar === id);
  const getObraById = (idObra: number) => obras.find(o => o.idObra === idObra);

  if (loading) return <div className="p-8">Carregando mapa...</div>;

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
                  placeholder="Buscar livro por título ou autor..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              {highlightedBook && (() => {
                const ex = getExemplarById(highlightedBook);
                if (!ex || !ex.localizacao) return null;
                return (
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm">
                      <MapPin className="inline w-4 h-4 mr-2 text-primary" />
                      Livro localizado no{" "}
                      <span className="font-medium">
                        Setor {ex.localizacao.sessao} - Prateleira {ex.localizacao.estante}
                      </span>
                    </p>
                  </div>
                );
              })()}
            </Card>

            <Card className="p-0 overflow-hidden">
              <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
                <h3>Planta da Biblioteca</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Clique em um setor para explorar suas prateleiras
                </p>
              </div>
              <div className="relative bg-gradient-to-br from-background via-muted/20 to-background aspect-[4/3] p-8">
                <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                  <div className="w-32 h-3 bg-primary/30 rounded-full"></div>
                  <p className="text-xs font-medium bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    🚪 Entrada Principal
                  </p>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-muted rounded-lg border-2 border-border flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🏢</div>
                    <p className="text-xs font-medium">Atendimento</p>
                  </div>
                </div>

                {sectors.map((sector) => {
                  const count = exemplaresPorSessao(sector.id).length;
                  return (
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
                        onClick={() => handleSectorClick(sector.id)}
                        className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
                      >
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
                            {count} livro{count !== 1 ? "s" : ""}
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
                  );
                })}

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
                <h3>{selectedSector ? `Setor ${selectedSector}` : searchTerm ? "Resultados da busca" : "Todos os Setores"}</h3>
              </div>

              {searchTerm || selectedSector ? (
                <div>
                  {filteredExemplares.length > 0 ? (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {filteredExemplares.map((ex) => {
                        const obra = getObraById(ex.obra.idObra);
                        return (
                          <div
                            key={ex.idExemplar}
                            className={`p-3 rounded-lg border transition-all ${
                              highlightedBook === ex.idExemplar
                                ? "bg-primary/10 border-primary shadow-md"
                                : "bg-muted/30 border-border hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex gap-3">
                              <div className="w-12 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded flex-shrink-0 overflow-hidden">
                                {obra?.urlCapa ? (
                                  <img
                                    src={obra.urlCapa}
                                    alt={obra.titulo}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-2xl">
                                    📚
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium mb-1 line-clamp-1">
                                  {obra?.titulo || "Título não disponível"}
                                </h4>
                                <p className="text-xs text-muted-foreground mb-2">
                                  {obra?.autor || "Autor desconhecido"}
                                </p>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge variant="default" className="text-xs">
                                    Prateleira {ex.localizacao?.estante || "?"}
                                  </Badge>
                                  <Badge
                                    variant={ex.status === "DISPONIVEL" ? "success" : "warning"}
                                    className="text-xs"
                                  >
                                    {ex.status === "DISPONIVEL" ? "Disponível" : "Emprestado"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      Nenhum exemplar encontrado.
                    </p>
                  )}
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
                        onClick={() => handleSectorClick(sector.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${sector.color} hover:shadow-md`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4>{sector.name}</h4>
                          <Badge variant="default">
                            {exemplaresPorSessao(sector.id).length}
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