package com.fokam.ticket.repository;

import com.fokam.ticket.domain.Statut;
import com.fokam.ticket.domain.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    boolean existsByTitre(String titre);
    List<Ticket> findAllByStatutOrderByDateCreationDesc(Statut statut);
    List<Ticket> findAllByOrderByDateCreationDesc();
}
