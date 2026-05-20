import { useState } from "react";
import { BookCard } from "../components/BookCard";
import { Input } from "../components/Input";
import { Card } from "../components/Card";
import { books } from "../data/mockData";
import { useLibrary } from "../context/LibraryContext";
import { Search, Filter, Star } from "lucide-react";

export function Catalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedSector, setSelectedSector] = useState("all");
  const [availableOnly, setAvailableOnly] = useState(false);

  const genres = ["all", ...Array.from(new Set(books.map((b) => b.genre)))];
  const years = ["all", ...Array.from(new Set(books.map((b) => b.year.toString()))).sort().reverse()];
  const sectors = ["all", "A", "B", "C", "D"];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre;
    const matchesYear = selectedYear === "all" || book.year.toString() === selectedYear;
    const matchesSector = selectedSector === "all" || book.location?.sector === selectedSector;
    const matchesAvailability = !availableOnly || book.available;

    return matchesSearch && matchesGenre && matchesYear && matchesSector && matchesAvailability;
  });

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2">Catálogo de Livros</h1>
          <p className="text-muted-foreground">
            Explore nossa coleção completa de {books.length} livros
          </p>
        </div>

        <Card className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-5 h-5 text-primary" />
            <h3>Filtros de Busca</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por título ou autor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-2.5 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">Todos os gêneros</option>
              {genres.slice(1).map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2.5 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">Todos os anos</option>
              {years.slice(1).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-4 py-2.5 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">Todos os setores</option>
              {sectors.slice(1).map((sector) => (
                <option key={sector} value={sector}>
                  Setor {sector}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-input-background border border-border cursor-pointer">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span>Apenas disponíveis</span>
            </label>
          </div>
        </Card>

        <div className="mb-6">
          <p className="text-muted-foreground">
            Mostrando {filteredBooks.length} {filteredBooks.length === 1 ? "livro" : "livros"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        {filteredBooks.length === 0 && (
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
