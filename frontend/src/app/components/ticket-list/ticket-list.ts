import { Component, EventEmitter, Output, input } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-list',
  imports: [DatePipe, NgClass],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.css'
})
export class TicketList {
  tickets = input<Ticket[]>([]);
  @Output() fermer = new EventEmitter<number>();

  demanderFermeture(t: Ticket): void {
    if (confirm(`Fermer le ticket « ${t.titre} » ?`)) {
      this.fermer.emit(t.id);
    }
  }

  badgeClass(statut: string): string {
    return 'badge badge-' + statut.toLowerCase().replace('_', '-');
  }
}
