import { useState, useEffect } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Modal } from "../../components/Modal";
import {
  buscarObras,
  cadastrarObra,
  editarObra,
  removerObra,
} from "../../services/api";
import { toast } from "sonner";

interface Obra {
  idObra: number;
  titulo: string;
  autor: string;
  isbn: string;
  editora: string;
  anoPublicacao: number;
  edicao: string;
  idioma: string;
  sinopse: string;
  urlCapa: string;
  paginas: number;
  categorias?: any[];
}

export default function ObrasTab() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    isbn: "",
    editora: "",
    anoPublicacao: new Date().getFullYear(),
    edicao: "",
    idioma: "",
    sinopse: "",
    urlCapa: "",
    paginas: 0,
    idsCategorias: [] as number[], 
  });

  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    loadObras();
  }, []);

  async function loadObras() {
    setLoading(true);
    try {
      const data = await buscarObras(searchTerm || undefined);
      setObras(data);
    } catch (error) {
      toast.error("Erro ao carregar obras");
    } finally {
      setLoading(false);
    }
  }

  function cleanIsbn(isbn: string): string {
    let cleaned = isbn.replace(/[-\s]/g, ""); 
    return cleaned;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanedIsbn = cleanIsbn(formData.isbn);
    const payload = {
      ...formData,
      isbn: cleanedIsbn,
      anoPublicacao: Number(formData.anoPublicacao),
      paginas: Number(formData.paginas),
    };

    try {
      if (editingId) {
        await editarObra(editingId, payload);
        toast.success("Obra atualizada com sucesso!");
      } else {
        await cadastrarObra(payload);
        toast.success("Obra cadastrada com sucesso!");
      }
      setModalOpen(false);
      resetForm();
      loadObras();
    } catch (error: any) {
      console.error("Erro detalhado:", error);
      toast.error(error.message || "Erro ao salvar obra");
    }
  }

  async function handleDelete(id: number) {
    if (confirm("Tem certeza que deseja remover esta obra?")) {
      try {
        await removerObra(id);
        toast.success("Obra removida!");
        loadObras();
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  }

  function editObra(obra: Obra) {
    setEditingId(obra.idObra);
    setFormData({
      titulo: obra.titulo,
      autor: obra.autor,
      isbn: obra.isbn,
      editora: obra.editora || "",
      anoPublicacao: obra.anoPublicacao,
      edicao: obra.edicao || "",
      idioma: obra.idioma || "",
      sinopse: obra.sinopse || "",
      urlCapa: obra.urlCapa || "",
      paginas: obra.paginas || 0,
      idsCategorias: obra.categorias?.map((c) => c.idCategoria) || [],
    });
    setModalOpen(true);
  }

  function resetForm() {
    setEditingId(null);
    setFormData({
      titulo: "",
      autor: "",
      isbn: "",
      editora: "",
      anoPublicacao: new Date().getFullYear(),
      edicao: "",
      idioma: "",
      sinopse: "",
      urlCapa: "",
      paginas: 0,
      idsCategorias: [],
    });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 flex-1 max-w-md">
          <Input
            placeholder="Buscar por título, autor ou ISBN"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={() => loadObras()}>Buscar</Button>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
        >
          + Nova Obra
        </Button>
      </div>

      {loading && <p>Carregando...</p>}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2">Título</th>
              <th className="text-left py-2">Autor</th>
              <th className="text-left py-2">ISBN</th>
              <th className="text-left py-2">Ano</th>
              <th className="text-right py-2">Ações</th>
             </tr>
          </thead>
          <tbody>
            {obras.map((obra) => (
              <tr key={obra.idObra} className="border-b border-border/50">
                <td className="py-2">{obra.titulo}</td>
                <td>{obra.autor}</td>
                <td>{obra.isbn}</td>
                <td>{obra.anoPublicacao}</td>
                <td className="text-right">
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => editObra(obra)}>
                    Editar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(obra.idObra)}>
                    Remover
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar Obra" : "Nova Obra"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Título" value={formData.titulo} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} required />
          <Input label="Autor" value={formData.autor} onChange={(e) => setFormData({ ...formData, autor: e.target.value })} required />
          <Input label="ISBN" value={formData.isbn} onChange={(e) => setFormData({ ...formData, isbn: e.target.value })} required />
          <Input label="Editora" value={formData.editora} onChange={(e) => setFormData({ ...formData, editora: e.target.value })} />
          <Input label="Ano" type="number" value={formData.anoPublicacao} onChange={(e) => setFormData({ ...formData, anoPublicacao: parseInt(e.target.value) })} />
          <Input label="Edição" value={formData.edicao} onChange={(e) => setFormData({ ...formData, edicao: e.target.value })} />
          <Input label="Idioma" value={formData.idioma} onChange={(e) => setFormData({ ...formData, idioma: e.target.value })} />
          <Input label="Número de Páginas" type="number" value={formData.paginas} onChange={(e) => setFormData({ ...formData, paginas: parseInt(e.target.value) })} />
          <textarea
            className="w-full px-4 py-2 rounded-lg border border-border"
            placeholder="Sinopse"
            rows={4}
            value={formData.sinopse}
            onChange={(e) => setFormData({ ...formData, sinopse: e.target.value })}
          />
          <Input 
  label="URL da Capa" 
  value={formData.urlCapa} 
  onChange={(e) => {
    setFormData({ ...formData, urlCapa: e.target.value });
    setPreviewUrl(e.target.value);
  }} 
/>
{previewUrl && (
  <div className="mt-2">
    <p className="text-sm text-muted-foreground mb-1">Pré-visualização:</p>
    <img 
      src={previewUrl} 
      alt="Prévia da capa" 
      className="max-h-32 rounded border"
      onError={() => setPreviewUrl("")}
    />
  </div>
)}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}