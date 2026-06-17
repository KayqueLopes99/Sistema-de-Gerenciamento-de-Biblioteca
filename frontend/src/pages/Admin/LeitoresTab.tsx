import { useState, useEffect } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Modal } from "../../components/Modal";
import { listarLeitores, cadastrarLeitor, editarLeitor, bloquearLeitor, desbloquearLeitor, aprovarLeitor } from "../../services/api";
import { toast } from "sonner";

interface Leitor {
  idUsuario: number;
  nome: string;
  email: string;
  cpf: string;
  matricula: string;
  statusLeitor: string;
}

export default function LeitoresTab() {
  const [leitores, setLeitores] = useState<Leitor[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    matricula: "",
  });

  useEffect(() => {
    loadLeitores();
  }, []);

  async function loadLeitores() {
    try {
      const data = await listarLeitores();
      setLeitores(data);
    } catch (error) {
      toast.error("Erro ao carregar leitores");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingId) {
        await editarLeitor(editingId, formData);
        toast.success("Leitor atualizado!");
      } else {
        await cadastrarLeitor(formData);
        toast.success("Leitor cadastrado!");
      }
      setModalOpen(false);
      resetForm();
      loadLeitores();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleBlock(id: number, currentStatus: string) {
    try {
      if (currentStatus === "ATIVO") {
        await bloquearLeitor(id);
        toast.success("Leitor bloqueado");
      } else if (currentStatus === "SUSPENSO") {
        await desbloquearLeitor(id);
        toast.success("Leitor desbloqueado");
      } else if (currentStatus === "PENDENTE_APROVACAO") {
        await aprovarLeitor(id);
        toast.success("Leitor aprovado");
      }
      loadLeitores();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  function resetForm() {
    setEditingId(null);
    setFormData({ nome: "", email: "", senha: "", cpf: "", matricula: "" });
  }

  const statusColors: Record<string, string> = {
    ATIVO: "bg-green-100 text-green-800",
    SUSPENSO: "bg-red-100 text-red-800",
    PENDENTE_APROVACAO: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Button onClick={() => { resetForm(); setModalOpen(true); }}>+ Novo Leitor</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th>Nome</th>
              <th>Email</th>
              <th>CPF</th>
              <th>Matrícula</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {leitores.map((leitor) => (
              <tr key={leitor.idUsuario} className="border-b border-border/50">
                <td>{leitor.nome}</td>
                <td>{leitor.email}</td>
                <td>{leitor.cpf}</td>
                <td>{leitor.matricula}</td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs ${statusColors[leitor.statusLeitor]}`}>
                    {leitor.statusLeitor}
                  </span>
                </td>
                <td>
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => {
                    setEditingId(leitor.idUsuario);
                    setFormData({
                      nome: leitor.nome,
                      email: leitor.email,
                      senha: "",
                      cpf: leitor.cpf,
                      matricula: leitor.matricula,
                    });
                    setModalOpen(true);
                  }}>Editar</Button>
                  <Button
                    variant={leitor.statusLeitor === "ATIVO" ? "destructive" : "secondary"}
                    size="sm"
                    onClick={() => handleBlock(leitor.idUsuario, leitor.statusLeitor)}
                  >
                    {leitor.statusLeitor === "ATIVO" && "Bloquear"}
                    {leitor.statusLeitor === "SUSPENSO" && "Desbloquear"}
                    {leitor.statusLeitor === "PENDENTE_APROVACAO" && "Aprovar"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar Leitor" : "Novo Leitor"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nome" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
          <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          <Input label="Senha" type="password" value={formData.senha} onChange={(e) => setFormData({ ...formData, senha: e.target.value })} required={!editingId} />
          <Input label="CPF" value={formData.cpf} onChange={(e) => setFormData({ ...formData, cpf: e.target.value })} required />
          <Input label="Matrícula" value={formData.matricula} onChange={(e) => setFormData({ ...formData, matricula: e.target.value })} required />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}