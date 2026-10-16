package com.fokam.ticket.web;

import com.fokam.ticket.domain.Statut;
import com.fokam.ticket.dto.TicketRequestDTO;
import com.fokam.ticket.dto.TicketResponseDTO;
import com.fokam.ticket.service.TicketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService service;

    public TicketController(TicketService service) {
        this.service = service;
    }

    @PostMapping
    @Operation(summary = "Creer un ticket")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Ticket cree"),
        @ApiResponse(responseCode = "400", description = "Titre invalide"),
        @ApiResponse(responseCode = "409", description = "RG-02 : titre deja utilise")
    })
    public ResponseEntity<TicketResponseDTO> creer(@Valid @RequestBody TicketRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.creer(dto));
    }

    @GetMapping
    @Operation(summary = "Lister les tickets (filtre optionnel par statut)")
    @ApiResponse(responseCode = "200", description = "Liste des tickets")
    public List<TicketResponseDTO> lister(@RequestParam(required = false) Statut statut) {
        return service.lister(statut);
    }

    @PatchMapping("/{id}/fermer")
    @Operation(summary = "Fermer un ticket")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Ticket ferme"),
        @ApiResponse(responseCode = "404", description = "Ticket introuvable"),
        @ApiResponse(responseCode = "409", description = "RG-03 : ticket deja ferme")
    })
    public TicketResponseDTO fermer(@PathVariable Long id) {
        return service.fermer(id);
    }
}
