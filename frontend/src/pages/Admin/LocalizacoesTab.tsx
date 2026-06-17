import { useState, useEffect } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Modal } from "../../components/Modal";
import { listarLocalizacoes, cadastrarLocalizacao, editarLocalizacao } from "../../services/api";
import { toast } from "sonner";

interface Localizacao {
  idLocalizacao: number;
  sala: string;
  estante: string;
  sessao: string;
  descricao: string;
}

export default function LocalizacoesTab() {
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    sala: "",
    estante: "",
    sessao: "",
    descricao: "",
  });

  useEffect(() => {
    loadLocalizacoes();
  }, []);

  async function loadLocalizacoes() {
    try {
      const data = await listarLocalizacoes();
      setLocalizacoes(data);
    } catch (error) {
      toast.error("Erro ao carregar localizações");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingId) {
        await editarLocalizacao(editingId, formData);
        toast.success("Localização atualizada!");
      } else {
        await cadastrarLocalizacao(formData);
        toast.success("Localização cadastrada!");
      }
      setModalOpen(false);
      resetForm();
      loadLocalizacoes();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  function resetForm() {
    setEditingId(null);
    setFormData({ sala: "", estante: "", sessao: "", descricao: "" });
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Button onClick={() => { resetForm(); setModalOpen(true); }}>+ Nova Localização</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {localizacoes.map((loc) => (
          <div key={loc.idLocalizacao} className="p-4 border border-border rounded-lg">
            <h3 className="font-bold">{loc.sala} - {loc.estante} - {loc.sessao}</h3>
            <p className="text-sm text-muted-foreground">{loc.descricao}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => {
              setEditingId(loc.idLocalizacao);
              setFormData({
                sala: loc.sala,
                estante: loc.estante,
                sessao: loc.sessao,
                descricao: loc.descricao,
              });
              setModalOpen(true);
            }}>Editar</Button>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar Localização" : "Nova Localização"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Sala" value={formData.sala} onChange={(e) => setFormData({ ...formData, sala: e.target.value })} required />
          <Input label="Estante" value={formData.estante} onChange={(e) => setFormData({ ...formData, estante: e.target.value })} required />
          <Input label="Sessão" value={formData.sessao} onChange={(e) => setFormData({ ...formData, sessao: e.target.value })} required />
          <Input label="Descrição" value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}