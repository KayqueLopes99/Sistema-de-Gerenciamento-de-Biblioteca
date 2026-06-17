import { useState, useEffect } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Modal } from "../../components/Modal";
import {
  listarEmprestimosAtivos,
  realizarEmprestimo,
  registrarDevolucao,
  renovarEmprestimo,
  registrarReservaBibliotecario,
  listarLeitores,
  listarExemplares,
  buscarObras,
} from "../../services/api";
import { toast } from "sonner";

interface Emprestimo {
  idEmprestimo: number;
  dataEmprestimo: string;
  dataDevolucaoPrevista: string;
  dataDevolucaoReal: string | null;
  leitor: { idUsuario: number; nome: string };
  exemplar: { idExemplar: number; codigoBarras: string; obra: { titulo: string } };
}

export default function EmprestimosTab() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [leitores, setLeitores] = useState<any[]>([]);
  const [exemplares, setExemplares] = useState<any[]>([]);
  const [obras, setObras] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [reservaModalOpen, setReservaModalOpen] = useState(false);
  const [selectedLeitorId, setSelectedLeitorId] = useState(0);
  const [selectedExemplarId, setSelectedExemplarId] = useState(0);
  const [selectedObraId, setSelectedObraId] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [emp, leit, exem, obr] = await Promise.all([
        listarEmprestimosAtivos(),
        listarLeitores(),
        listarExemplares(),
        buscarObras(),
      ]);
      setEmprestimos(emp);
      setLeitores(leit);
      setExemplares(exem);
      setObras(obr);
    } catch (error) {
      toast.error("Erro ao carregar dados");
    }
  }

  async function handleRealizarEmprestimo() {
    if (!selectedLeitorId || !selectedExemplarId) {
      toast.error("Selecione leitor e exemplar");
      return;
    }
    try {
      await realizarEmprestimo(selectedLeitorId, selectedExemplarId);
      toast.success("Empréstimo realizado!");
      setModalOpen(false);
      loadData();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleDevolucao(idExemplar: number) {
    try {
      await registrarDevolucao(idExemplar);
      toast.success("Devolução registrada!");
      loadData();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleRenovacao(idEmprestimo: number) {
    try {
      await renovarEmprestimo(idEmprestimo);
      toast.success("Empréstimo renovado!");
      loadData();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleReserva() {
    if (!selectedLeitorId || !selectedObraId) {
      toast.error("Selecione leitor e obra");
      return;
    }
    try {
      await registrarReservaBibliotecario(selectedLeitorId, selectedObraId);
      toast.success("Reserva registrada!");
      setReservaModalOpen(false);
      loadData();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <Button onClick={() => setModalOpen(true)}>Realizar Empréstimo</Button>
        <Button variant="secondary" onClick={() => setReservaModalOpen(true)}>Registrar Reserva</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th>Leitor</th>
              <th>Livro</th>
              <th>Cód. Barras</th>
              <th>Data Empréstimo</th>
              <th>Devolução Prevista</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {emprestimos.map((emp) => (
              <tr key={emp.idEmprestimo} className="border-b border-border/50">
                <td>{emp.leitor.nome}</td>
                <td>{emp.exemplar.obra.titulo}</td>
                <td>{emp.exemplar.codigoBarras}</td>
                <td>{new Date(emp.dataEmprestimo).toLocaleDateString()}</td>
                <td>{new Date(emp.dataDevolucaoPrevista).toLocaleDateString()}</td>
                <td>{emp.dataDevolucaoReal ? "Devolvido" : "Ativo"}</td>
                <td>
                  {!emp.dataDevolucaoReal && (
                    <>
                      <Button size="sm" className="mr-2" onClick={() => handleRenovacao(emp.idEmprestimo)}>Renovar</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDevolucao(emp.exemplar.idExemplar)}>Devolver</Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Realizar Empréstimo">
        <div className="space-y-4">
          <select className="w-full p-2 border rounded" value={selectedLeitorId} onChange={(e) => setSelectedLeitorId(parseInt(e.target.value))}>
            <option value={0}>Selecione o leitor</option>
            {leitores.map((l) => (
              <option key={l.idUsuario} value={l.idUsuario}>{l.nome} - {l.matricula}</option>
            ))}
          </select>
          <select className="w-full p-2 border rounded" value={selectedExemplarId} onChange={(e) => setSelectedExemplarId(parseInt(e.target.value))}>
            <option value={0}>Selecione o exemplar</option>
            {exemplares.map((ex) => (
              <option key={ex.idExemplar} value={ex.idExemplar}>
                {ex.obra.titulo} - {ex.codigoBarras} ({ex.status})
              </option>
            ))}
          </select>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleRealizarEmprestimo}>Confirmar</Button>
          </div>
        </div>
      </Modal>
      
      <Modal isOpen={reservaModalOpen} onClose={() => setReservaModalOpen(false)} title="Registrar Reserva">
        <div className="space-y-4">
          <select className="w-full p-2 border rounded" value={selectedLeitorId} onChange={(e) => setSelectedLeitorId(parseInt(e.target.value))}>
            <option value={0}>Selecione o leitor</option>
            {leitores.map((l) => (
              <option key={l.idUsuario} value={l.idUsuario}>{l.nome}</option>
            ))}
          </select>
          <select className="w-full p-2 border rounded" value={selectedObraId} onChange={(e) => setSelectedObraId(parseInt(e.target.value))}>
            <option value={0}>Selecione a obra</option>
            {obras.map((o) => (
              <option key={o.idObra} value={o.idObra}>{o.titulo}</option>
            ))}
          </select>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setReservaModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleReserva}>Reservar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}