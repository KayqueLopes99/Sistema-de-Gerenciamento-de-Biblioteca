package com.biblioteca.gerenciador.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import com.biblioteca.gerenciador.enums.StatusReserva;

@Entity
@Table(name = "reserva")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idReserva;

    private LocalDate dataReserva;

    @Enumerated(EnumType.STRING)
    private StatusReserva status;

    @ManyToOne
    @JoinColumn(name = "id_leitor")
    private Leitor leitor;

    @ManyToOne
    @JoinColumn(name = "id_obra")
    private Obra obra;

    public Reserva() {
    }

    public Reserva(int idReserva, LocalDate dataReserva,
            StatusReserva status, Leitor leitor, Obra obra) {
        this.idReserva = idReserva;
        this.dataReserva = dataReserva;
        this.status = status;
        this.leitor = leitor;
        this.obra = obra;
    }

    public int getIdReserva() {
        return idReserva;
    }

    public void setIdReserva(int idReserva) {
        this.idReserva = idReserva;
    }

    public LocalDate getDataReserva() {
        return dataReserva;
    }

    public void setDataReserva(LocalDate dataReserva) {
        this.dataReserva = dataReserva;
    }

    public StatusReserva getStatus() {
        return status;
    }

    public void setStatus(StatusReserva status) {
        this.status = status;
    }

    public Leitor getLeitor() {
        return leitor;
    }

    public void setLeitor(Leitor leitor) {
        this.leitor = leitor;
    }

    public Obra getObra() {
        return obra;
    }

    public void setObra(Obra obra) {
        this.obra = obra;
    }
}