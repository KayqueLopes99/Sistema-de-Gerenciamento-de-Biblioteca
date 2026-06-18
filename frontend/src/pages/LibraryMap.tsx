import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { listarExemplares, listarLocalizacoes, buscarObras } from "../services/api";
import { Search, MapPin, Book as BookIcon, ExternalLink, Filter } from "lucide-react";

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

  // Carrega os dados iniciais do servidor
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

  // Efeito reativo idêntico ao do catálogo para filtrar os livros dinamicamente com Debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      let filtered = exemplares;

      if (selectedSector) {
        filtered = filtered.filter(ex => ex.localizacao?.sessao === selectedSector);
      }

      if (searchTerm.trim() !== "") {
        const lowerTerm = searchTerm.toLowerCase();
        filtered = filtered.filter(ex => 
          ex.obra.titulo.toLowerCase().includes(lowerTerm) ||
          ex.obra.autor.toLowerCase().includes(lowerTerm) ||
          ex.codigoBarras.toLowerCase().includes(lowerTerm)
        );
      }

      setFilteredExemplares(filtered);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedSector, exemplares]);

  const handleSectorClick = (sectorId: string) => {
    // Se clicar no mesmo setor já selecionado, limpa o filtro. Caso contrário, aplica o filtro dele.
    if (selectedSector === sectorId) {
      setSelectedSector(null);
    } else {
      setSelectedSector(sectorId);
    }
    setHighlightedBook(null);
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
            Localize livros e navegue pelos setores da biblioteca de forma interativa
          </p>
        </div>

        {/* Barra de Filtros Unificada no topo da Tela */}
        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-primary" />
            <h3>Filtros de Localização</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar livro por título, autor ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={selectedSector || ""}
              onChange={(e) => {
                setSelectedSector(e.target.value || null);
                setHighlightedBook(null);
              }}
              className="px-4 py-2.5 rounded-lg bg-input-background border border-border"
            >
              <option value="">Todos os Setores / Biblioteca Inteira</option>
              {sectors.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.name}
                </option>
              ))}
            </select>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-0 overflow-hidden">
              <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
                <h3>Planta da Biblioteca</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Os setores azuis representam as salas físicas. Clique para isolar a lista lateral.
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
                  const isSelected = selectedSector === sector.id;
                  return (
                    <div
                      key={sector.id}
                      onClick={() => handleSectorClick(sector.id)}
                      className={`absolute border-2 rounded-lg cursor-pointer transition-all ${
                        sector.color
                      } ${
                        isSelected
                          ? "ring-4 ring-primary bg-primary/20 shadow-2xl z-10 scale-[1.02]"
                          : "shadow-md opacity-80 hover:opacity-100"
                      }`}
                      style={{
                        top: sector.position.top,
                        left: sector.position.left,
                        width: sector.size.width,
                        height: sector.size.height,
                      }}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                        <div className="absolute inset-4 grid grid-cols-3 gap-1 opacity-20">
                          {[...Array(9)].map((_, i) => (
                            <div key={i} className="bg-foreground rounded-sm"></div>
                          ))}
                        </div>
                        <div className="relative z-10">
                          <div className="text-4xl mb-2">📚</div>
                          <h4 className="mb-1 bg-background/80 px-2 py-0.5 rounded text-sm font-semibold">{sector.name}</h4>
                          <Badge variant={isSelected ? "default" : "outline"} className="bg-background/90 mt-1">
                            {count} livro{count !== 1 ? "s" : ""}
                          </Badge>
                        </div>
                      </div>

                      <Link
                        to={`/sector/${sector.id}`}
                        className="absolute bottom-2 right-2 p-1.5 bg-background/90 rounded-lg hover:bg-background transition-colors shadow-sm border border-border"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  );
                })}

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                  <div className="flex gap-2">
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

          {/* Painel de Resultados Lateral */}
          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <BookIcon className="w-5 h-5 text-primary" />
                  <h3>Resultados</h3>
                </div>
                <Badge variant="secondary">
                  {filteredExemplares.length} encontrado{filteredExemplares.length !== 1 ? "s" : ""}
                </Badge>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[550px] pr-1">
                {filteredExemplares.map((ex) => {
                  const obra = getObraById(ex.obra.idObra);
                  return (
                    <div
                      key={ex.idExemplar}
                      onClick={() => setHighlightedBook(highlightedBook === ex.idExemplar ? null : ex.idExemplar)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        highlightedBook === ex.idExemplar
                          ? "bg-primary/10 border-primary shadow-md ring-1 ring-primary"
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
                          <h4 className="text-sm font-medium mb-0.5 line-clamp-1">
                            {obra?.titulo || "Título não disponível"}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-1">
                            {obra?.autor || "Autor desconhecido"}
                          </p>
                          <p className="text-[11px] text-primary font-mono mb-2">
                            Seção: {ex.localizacao?.sessao || "Não definida"}
                          </p>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Badge variant="default" className="text-[10px] px-2 py-0">
                              Estante {ex.localizacao?.estante || "?"}
                            </Badge>
                            <Badge
                              variant={ex.status === "DISPONIVEL" ? "success" : "warning"}
                              className="text-[10px] px-2 py-0"
                            >
                              {ex.status === "DISPONIVEL" ? "Disponível" : "Emprestado"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Exibe detalhes extras do endereço físico se o livro for clicado */}
                      {highlightedBook === ex.idExemplar && ex.localizacao && (
                        <div className="mt-3 pt-2 border-t border-primary/20 text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span>Local exato: Sala {ex.localizacao.sala}, Estante {ex.localizacao.estante}, Posição {ex.localizacao.sessao}</span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredExemplares.length === 0 && (
                  <div className="text-center text-muted-foreground py-12">
                    <span className="text-3xl block mb-2">🔍</span>
                    <p className="text-sm">Nenhum exemplar corresponde à sua busca atual.</p>
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