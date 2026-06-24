import { useState, useEffect } from "react";
import { BookCard } from "../components/BookCard";
import { Input } from "../components/Input";
import { Card } from "../components/Card";
import { buscarObras, listarCategorias } from "../services/api";
import { Search, Filter } from "lucide-react";

export function Catalog() {
  const [obras, setObras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAno, setSelectedAno] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [emAlta, setEmAlta] = useState(false);
  const [categorias, setCategorias] = useState<any[]>([]);

  useEffect(() => {
    loadCategorias();
  }, []);

  async function loadCategorias() {
    try {
      const data = await listarCategorias();
      setCategorias(data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadObras();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedAno, selectedCategoria, emAlta]);

  async function loadObras() {
    setLoading(true);
    try {
      const data = await buscarObras(
        searchTerm || undefined,
        selectedAno ? parseInt(selectedAno) : undefined,
        selectedCategoria || undefined,
        emAlta
      );
      setObras(data);
    } catch (error) {
      console.error("Erro ao buscar obras:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2">Catálogo de Livros</h1>
          <p className="text-muted-foreground">
            Explore nossa coleção completa de {obras.length} livros
          </p>
        </div>

        <Card className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-5 h-5 text-primary" />
            <h3>Filtros de Busca</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Título, autor ou ISBN"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={selectedAno}
              onChange={(e) => setSelectedAno(e.target.value)}
              className="px-4 py-2.5 rounded-lg bg-input-background border border-border"
            >
              <option value="">Todos os anos</option>
              {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((ano) => (
                <option key={ano} value={ano}>{ano}</option>
              ))}
            </select>

            <select
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
              className="px-4 py-2.5 rounded-lg bg-input-background border border-border"
            >
              <option value="">Todas as categorias</option>
              {categorias.map((cat) => (
                <option key={cat.idCategoria} value={cat.nome}>{cat.nome}</option>
              ))}
            </select>

            <label className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-input-background border border-border cursor-pointer">
              <input
                type="checkbox"
                checked={emAlta}
                onChange={(e) => setEmAlta(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span>Livros em alta</span>
            </label>
          </div>
        </Card>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-muted-foreground">
                Mostrando {obras.length} {obras.length === 1 ? "livro" : "livros"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {obras.map((obra) => (
                <BookCard
                  key={obra.idObra}
                  book={{
                    id: obra.idObra,
                    title: obra.titulo,
                    author: obra.autor,
                    year: obra.anoPublicacao,
                    cover: obra.urlCapa,
                    available: true,
                  }}
                />
              ))}
            </div>
          </>
        )}

        {!loading && obras.length === 0 && (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="mb-2">Nenhum livro encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros de busca
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}