import { useState, useEffect } from "react";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { listarReservasPendentes, atenderReserva, cancelarReserva } from "../../services/api";
import { toast } from "sonner";

interface Reserva {
  idReserva: number;
  dataReserva: string;
  status: string;
  leitor: { idUsuario: number; nome: string; email: string };
  obra: { idObra: number; titulo: string; autor: string };
}

export default function ReservasTab() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReservas();
  }, []);

  async function loadReservas() {
    setLoading(true);
    try {
      const data = await listarReservasPendentes();
      setReservas(data);
    } catch (error) {
      toast.error("Erro ao carregar reservas");
    } finally {
      setLoading(false);
    }
  }

  async function handleAtender(id: number) {
    try {
      await atenderReserva(id);
      toast.success("Reserva atendida!");
      loadReservas();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleCancelar(id: number) {
    if (!confirm("Cancelar esta reserva?")) return;
    try {
      await cancelarReserva(id);
      toast.success("Reserva cancelada");
      loadReservas();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  if (loading) return <p>Carregando reservas...</p>;

  return (
    <div>
      <h3 className="mb-4">Solicitações de Reserva Pendentes</h3>
      {reservas.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma reserva pendente no momento.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2">Leitor</th>
                <th className="text-left py-2">Obra</th>
                <th className="text-left py-2">Data da Reserva</th>
                <th className="text-left py-2">Status</th>
                <th className="text-right py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((res) => (
                <tr key={res.idReserva} className="border-b border-border/50">
                  <td className="py-2">{res.leitor.nome}</td>
                  <td className="py-2">{res.obra.titulo}</td>
                  <td className="py-2">{new Date(res.dataReserva).toLocaleDateString()}</td>
                  <td className="py-2">
                    <Badge variant="warning">Pendente</Badge>
                  </td>
                  <td className="text-right py-2">
                    <Button size="sm" className="mr-2" onClick={() => handleAtender(res.idReserva)}>
                      Atender
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleCancelar(res.idReserva)}>
                      Cancelar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}