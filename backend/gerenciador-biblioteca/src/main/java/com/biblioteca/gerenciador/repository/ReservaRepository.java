package com.biblioteca.gerenciador.repository;

import com.biblioteca.gerenciador.enums.StatusReserva;
import com.biblioteca.gerenciador.model.Obra;
import com.biblioteca.gerenciador.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Integer> {
    
    boolean existsByObraAndStatus(Obra obra, StatusReserva status);
    
    List<Reserva> findByLeitor_IdUsuarioAndStatus(int idLeitor, StatusReserva status);
    
    List<Reserva> findByObraAndStatusOrderByDataReservaAsc(Obra obra, StatusReserva status);
}