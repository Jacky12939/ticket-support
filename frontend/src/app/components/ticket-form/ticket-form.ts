import { Component, EventEmitter, Output, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TicketRequest } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-form',
  imports: [FormsModule],
  templateUrl: './ticket-form.html',
  styleUrl: './ticket-form.css'
})
export class TicketForm {
  erreurServeur = input<string>('');
  @Output() creer = new EventEmitter<TicketRequest>();

  titre = signal('');
  description = signal('');

  get titreVide(): boolean {
    return this.titre().trim().length === 0;
  }

  soumettre(): void {
    if (this.titreVide) return;
    this.creer.emit({ titre: this.titre(), description: this.description() });
    this.titre.set('');
    this.description.set('');
  }
}
