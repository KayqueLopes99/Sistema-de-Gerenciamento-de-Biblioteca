import { useState } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Badge } from "../components/Badge";
import { books } from "../data/mockData";
import { useLibrary } from "../context/LibraryContext";
import { Plus, Edit, Trash2, Search } from "lucide-react";

export function Admin() {
  const { isBookLoaned } = useLibrary();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    year: "",
    genre: "",
    description: "",
    isbn: "",
    sector: "",
    shelf: "",
  });

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddForm(false);
    setFormData({
      title: "",
      author: "",
      year: "",
      genre: "",
      description: "",
      isbn: "",
      sector: "",
      shelf: "",
    });
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2">Administração</h1>
            <p className="text-muted-foreground">
              Gerencie o acervo de livros da biblioteca
            </p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Livro
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-6">
            <h3 className="mb-6">Adicionar Novo Livro</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Título"
                  placeholder="Título do livro"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <Input
                  label="Autor"
                  placeholder="Nome do autor"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                />
                <Input
                  label="Ano de Publicação"
                  type="number"
                  placeholder="2024"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  required
                />
                <Input
                  label="Gênero"
                  placeholder="Romance, Ficção, etc."
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  required
                />
                <Input
                  label="ISBN"
                  placeholder="978-3-16-148410-0"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                />
                <div>
                  <label className="block mb-2 text-foreground">Setor</label>
                  <select
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  >
                    <option value="">Selecione o setor</option>
                    <option value="A">Setor A - Clássicos (Séc. XIX)</option>
                    <option value="B">Setor B - Literatura Moderna</option>
                    <option value="C">Setor C - Romantismo</option>
                    <option value="D">Setor D - Modernismo</option>
                  </select>
                </div>
                <Input
                  label="Prateleira"
                  placeholder="1, 2, 3..."
                  value={formData.shelf}
                  onChange={(e) => setFormData({ ...formData, shelf: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-foreground">Descrição</label>
                <textarea
                  className="w-full px-4 py-2.5 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all min-h-[120px]"
                  placeholder="Sinopse do livro..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit">Salvar Livro</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

        <Card className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar livros por título ou autor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        <Card>
          <div className="mb-6">
            <h3>Acervo Completo</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredBooks.length} {filteredBooks.length === 1 ? "livro" : "livros"} encontrado(s)
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Título</th>
                  <th className="text-left py-3 px-4">Autor</th>
                  <th className="text-left py-3 px-4">Ano</th>
                  <th className="text-left py-3 px-4">Gênero</th>
                  <th className="text-left py-3 px-4">Localização</th>
                  <th className="text-left py-3 px-4">Exemplares</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => {
                  const loaned = isBookLoaned(book.id);
                  return (
                    <tr key={book.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium">{book.title}</td>
                      <td className="py-3 px-4 text-muted-foreground">{book.author}</td>
                      <td className="py-3 px-4 text-muted-foreground">{book.year}</td>
                      <td className="py-3 px-4 text-muted-foreground">{book.genre}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {book.location ? `${book.location.sector}-${book.location.shelf}` : "-"}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{book.copies || 1}</td>
                      <td className="py-3 px-4">
                        <Badge variant={loaned ? "warning" : "success"}>
                          {loaned ? "Emprestado" : "Disponível"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="mb-2">Nenhum livro encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar sua busca ou adicione um novo livro ao acervo
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
