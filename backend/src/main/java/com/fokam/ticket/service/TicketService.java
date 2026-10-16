package com.fokam.ticket.service;

import com.fokam.ticket.domain.Statut;
import com.fokam.ticket.domain.Ticket;
import com.fokam.ticket.dto.TicketRequestDTO;
import com.fokam.ticket.dto.TicketResponseDTO;
import com.fokam.ticket.exception.BusinessRuleException;
import com.fokam.ticket.exception.ResourceNotFoundException;
import com.fokam.ticket.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TicketService {

    private final TicketRepository repository;

    public TicketService(TicketRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public TicketResponseDTO creer(TicketRequestDTO dto) {
        if (repository.existsByTitre(dto.getTitre())) {
            throw new BusinessRuleException("RG-02",
                "Un ticket avec ce titre existe deja.");
        }
        Ticket ticket = new Ticket();
        ticket.setTitre(dto.getTitre());
        ticket.setDescription(dto.getDescription());
        ticket.setStatut(Statut.OUVERT);
        return toDto(repository.save(ticket));
    }

    @Transactional(readOnly = true)
    public List<TicketResponseDTO> lister(Statut statut) {
        List<Ticket> tickets = (statut == null)
            ? repository.findAllByOrderByDateCreationDesc()
            : repository.findAllByStatutOrderByDateCreationDesc(statut);
        return tickets.stream().map(this::toDto).toList();
    }

    @Transactional
    public TicketResponseDTO fermer(Long id) {
        Ticket ticket = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Aucun ticket avec l'identifiant " + id + "."));
        if (ticket.getStatut() == Statut.FERME) {
            throw new BusinessRuleException("RG-03",
                "RG-03 : un ticket deja FERME ne peut pas etre ferme a nouveau.");
        }
        ticket.setStatut(Statut.FERME);
        return toDto(repository.save(ticket));
    }

    private TicketResponseDTO toDto(Ticket t) {
        return new TicketResponseDTO(
            t.getId(), t.getTitre(), t.getDescription(),
            t.getStatut(), t.getDateCreation()
        );
    }
}
