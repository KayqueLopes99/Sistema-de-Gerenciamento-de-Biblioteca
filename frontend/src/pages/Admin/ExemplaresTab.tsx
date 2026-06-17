import { useState, useEffect } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Modal } from "../../components/Modal";
import {
  listarExemplares,
  cadastrarExemplar,
  editarExemplar,
  removerExemplar,
  associarLocalizacao,
  listarLocalizacoes,
  buscarObras,
} from "../../services/api";
import { toast } from "sonner";

interface Exemplar {
  idExemplar: number;
  codigoBarras: string;
  estadoConservacao: string;
  status: string;
  obra: { idObra: number; titulo: string };
  localizacao?: { idLocalizacao: number; sala: string; estante: string; sessao: string };
  idLocalizacao?: number;
}

export default function ExemplaresTab() {
  const [exemplares, setExemplares] = useState<Exemplar[]>([]);
  const [obras, setObras] = useState<any[]>([]);
  const [localizacoes, setLocalizacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    codigoBarras: "",
    estadoConservacao: "",
    status: "DISPONIVEL",
    idObra: 0,
    idLocalizacao: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [exemplaresData, obrasData, locsData] = await Promise.all([
        listarExemplares(),
        buscarObras(),
        listarLocalizacoes(),
      ]);
      setExemplares(exemplaresData);
      setObras(obrasData);
      setLocalizacoes(locsData);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  function getLocalizacaoNome(idLocalizacao?: number): string {
    if (!idLocalizacao) return "Sem localização";
    const loc = localizacoes.find(l => l.idLocalizacao === idLocalizacao);
    return loc ? `${loc.sala} / ${loc.estante} / ${loc.sessao}` : "Localização não encontrada";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingId) {
        await editarExemplar(editingId, formData);
        toast.success("Exemplar atualizado!");
      } else {
        await cadastrarExemplar(formData);
        toast.success("Exemplar cadastrado!");
      }
      setModalOpen(false);
      resetForm();
      loadData();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleDelete(id: number) {
    if (confirm("Remover este exemplar?")) {
      try {
        await removerExemplar(id);
        toast.success("Removido!");
        loadData();
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  }

  async function handleAssociarLocalizacao(idExemplar: number, idLocalizacao: number) {
    if (!idLocalizacao) {
      toast.error("Selecione uma localização válida");
      return;
    }
    try {
      await associarLocalizacao(idExemplar, idLocalizacao);
      
      // Atualiza localmente o exemplar com a nova localização
      const loc = localizacoes.find(l => l.idLocalizacao === idLocalizacao);
      setExemplares(prev =>
        prev.map(ex =>
          ex.idExemplar === idExemplar
            ? { ...ex, idLocalizacao, localizacao: loc }
            : ex
        )
      );
      toast.success("Localização associada!");
      
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  function resetForm() {
    setEditingId(null);
    setFormData({
      codigoBarras: "",
      estadoConservacao: "",
      status: "DISPONIVEL",
      idObra: 0,
      idLocalizacao: 0,
    });
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Button onClick={() => { resetForm(); setModalOpen(true); }}>+ Novo Exemplar</Button>
      </div>

      {loading && <p>Carregando...</p>}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th>Código Barras</th>
              <th>Obra</th>
              <th>Status</th>
              <th>Localização</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {exemplares.map((ex) => {
              const localizacaoId = ex.localizacao?.idLocalizacao || ex.idLocalizacao;
              return (
                <tr key={ex.idExemplar} className="border-b border-border/50">
                  <td className="py-2 px-2">{ex.codigoBarras}</td>
                  <td className="py-2 px-2">{ex.obra.titulo}</td>
                  <td className="py-2 px-2">{ex.status}</td>
                  <td className="py-2 px-2">
                    <span className="mr-2">{getLocalizacaoNome(localizacaoId)}</span>
                    <select
                      className="text-sm border rounded p-1"
                      onChange={(e) => handleAssociarLocalizacao(ex.idExemplar, parseInt(e.target.value))}
                      value=""
                    >
                      <option value="">Associar localização</option>
                      {localizacoes.map((loc) => (
                        <option key={loc.idLocalizacao} value={loc.idLocalizacao}>
                          {loc.sala} - {loc.estante} - {loc.sessao}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-2">
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => {
                      setEditingId(ex.idExemplar);
                      setFormData({
                        codigoBarras: ex.codigoBarras,
                        estadoConservacao: ex.estadoConservacao || "",
                        status: ex.status,
                        idObra: ex.obra.idObra,
                        idLocalizacao: localizacaoId || 0,
                      });
                      setModalOpen(true);
                    }}>Editar</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(ex.idExemplar)}>Remover</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar Exemplar" : "Novo Exemplar"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Código de Barras" value={formData.codigoBarras} onChange={(e) => setFormData({ ...formData, codigoBarras: e.target.value })} required />
          <Input label="Estado de Conservação" value={formData.estadoConservacao} onChange={(e) => setFormData({ ...formData, estadoConservacao: e.target.value })} />
          <select
            className="w-full px-4 py-2 rounded-lg border border-border"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="DISPONIVEL">Disponível</option>
            <option value="EMPRESTADO">Emprestado</option>
            <option value="RESERVADO">Reservado</option>
            <option value="MANUTENCAO">Manutenção</option>
          </select>
          <select
            className="w-full px-4 py-2 rounded-lg border border-border"
            value={formData.idObra}
            onChange={(e) => setFormData({ ...formData, idObra: parseInt(e.target.value) })}
            required
          >
            <option value={0}>Selecione a obra</option>
            {obras.map((obra) => (
              <option key={obra.idObra} value={obra.idObra}>{obra.titulo}</option>
            ))}
          </select>
          <select
            className="w-full px-4 py-2 rounded-lg border border-border"
            value={formData.idLocalizacao}
            onChange={(e) => setFormData({ ...formData, idLocalizacao: parseInt(e.target.value) })}
            required
          >
            <option value={0}>Selecione a localização</option>
            {localizacoes.map((loc) => (
              <option key={loc.idLocalizacao} value={loc.idLocalizacao}>{loc.sala} / {loc.estante} / {loc.sessao}</option>
            ))}
          </select>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}