import { Component, OnInit, signal } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { ApiError, Statut, Ticket, TicketRequest } from '../../models/ticket.model';
import { TicketList } from '../ticket-list/ticket-list';
import { TicketForm } from '../ticket-form/ticket-form';

type Etat = 'chargement' | 'donnees' | 'vide' | 'erreur';

@Component({
  selector: 'app-ticket-container',
  imports: [TicketList, TicketForm],
  templateUrl: './ticket-container.html',
  styleUrl: './ticket-container.css'
})
export class TicketContainer implements OnInit {

  etat = signal<Etat>('chargement');
  tickets = signal<Ticket[]>([]);
  filtre = signal<Statut | null>(null);
  erreurListe = signal('');
  erreurAction = signal('');

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.etat.set('chargement');
    this.erreurListe.set('');
    this.ticketService.lister(this.filtre()).subscribe({
      next: (data) => {
        this.tickets.set(data);
        this.etat.set(data.length === 0 ? 'vide' : 'donnees');
      },
      error: (err: ApiError) => {
        this.erreurListe.set(err.message);
        this.etat.set('erreur');
      }
    });
  }

  changerFiltre(value: string): void {
    this.filtre.set(value === '' ? null : (value as Statut));
    this.charger();
  }

  creerTicket(payload: TicketRequest): void {
    this.erreurAction.set('');
    this.ticketService.creer(payload).subscribe({
      next: () => this.charger(),
      error: (err: ApiError) => this.erreurAction.set(err.message)
    });
  }

  fermerTicket(id: number): void {
    this.erreurAction.set('');
    this.ticketService.fermer(id).subscribe({
      next: () => this.charger(),
      error: (err: ApiError) => this.erreurAction.set(err.message)
    });
  }
}
