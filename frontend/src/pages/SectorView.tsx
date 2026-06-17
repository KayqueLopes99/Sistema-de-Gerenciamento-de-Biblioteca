import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { listarExemplares, listarLocalizacoes, buscarObras } from "../services/api";
import { ArrowLeft, Star } from "lucide-react";

interface ExemplarDetalhado {
  idExemplar: number;
  codigoBarras: string;
  status: string;
  localizacao: { sala: string; estante: string; sessao: string };
  obra: { idObra: number; titulo: string; autor: string; urlCapa?: string; sinopse?: string };
}

export function SectorView() {
  const { sector } = useParams();
  const [exemplares, setExemplares] = useState<ExemplarDetalhado[]>([]);
  const [obrasMap, setObrasMap] = useState<Map<number, any>>(new Map());
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<{ name: string; description: string; color: string } | null>(null);

  useEffect(() => {
    if (sector) {
      loadSectorData();
    }
  }, [sector]);

  async function loadSectorData() {
    setLoading(true);
    try {
      const [exemplaresData, localizacoesData, obrasData] = await Promise.all([
        listarExemplares(),
        listarLocalizacoes(),
        buscarObras(),
      ]);

      const obrasMapLocal = new Map();
      obrasData.forEach((obra: any) => obrasMapLocal.set(obra.idObra, obra));
      setObrasMap(obrasMapLocal);

      const filtered = exemplaresData.filter(
        (ex: any) => ex.localizacao && ex.localizacao.sessao === sector
      );

      const enriched = filtered.map((ex: any) => ({
        ...ex,
        obra: obrasMapLocal.get(ex.obra.idObra) || { titulo: "Obra não encontrada", autor: "Desconhecido" },
      }));
      setExemplares(enriched);

      if (enriched.length > 0 && enriched[0].localizacao) {
        const sessao = enriched[0].localizacao.sessao;
        setInfo({
          name: `Setor ${sessao}`,
          description: `Livros localizados na sessão "${sessao}"`,
          color: "from-primary/20 to-primary/5",
        });
      } else {
        setInfo({
          name: `Setor ${sector}`,
          description: "Nenhum livro encontrado neste setor.",
          color: "from-muted/20 to-muted/5",
        });
      }
    } catch (error) {
      console.error("Erro ao carregar dados do setor:", error);
    } finally {
      setLoading(false);
    }
  }

  const groupedByShelf = exemplares.reduce((acc, ex) => {
    const shelf = ex.localizacao?.estante || "Sem prateleira";
    if (!acc[shelf]) acc[shelf] = [];
    acc[shelf].push(ex);
    return acc;
  }, {} as Record<string, ExemplarDetalhado[]>);

  const shelves = Object.keys(groupedByShelf).sort();

  if (loading) return <div className="p-8">Carregando setor...</div>;

  if (!info) {
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
                {exemplares.length} exemplar{exemplares.length !== 1 ? "es" : ""}
              </Badge>
            </div>
          </div>
        </Card>

        {shelves.length === 0 && (
          <Card className="text-center py-8">
            <p className="text-muted-foreground">Nenhum livro encontrado neste setor.</p>
          </Card>
        )}

        {shelves.map((shelf) => {
          const shelfExemplares = groupedByShelf[shelf];
          return (
            <Card key={shelf} className="mb-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div>
                  <h2>Prateleira {shelf}</h2>
                  <p className="text-sm text-muted-foreground">
                    {shelfExemplares.length} exemplar{shelfExemplares.length !== 1 ? "es" : ""}
                  </p>
                </div>
                <div className="text-5xl">📖</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {shelfExemplares.map((ex) => (
                  <Link key={ex.idExemplar} to={`/book/${ex.obra.idObra}`}>
                    <div className="bg-muted/30 rounded-lg p-4 border border-border hover:bg-muted/50 hover:shadow-md transition-all h-full flex flex-col">
                      <div className="aspect-[2/3] bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                        {ex.obra.urlCapa ? (
                          <img
                            src={ex.obra.urlCapa}
                            alt={ex.obra.titulo}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-5xl">📚</span>
                        )}
                      </div>
                      <h4 className="mb-2 line-clamp-2 flex-1">{ex.obra.titulo}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{ex.obra.autor}</p>
                      <Badge
                        variant={ex.status === "DISPONIVEL" ? "success" : "warning"}
                        className="w-full justify-center"
                      >
                        {ex.status === "DISPONIVEL" ? "Disponível" : "Emprestado"}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}