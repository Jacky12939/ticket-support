import { Component } from '@angular/core';
import { TicketContainer } from './components/ticket-container/ticket-container';

@Component({
  selector: 'app-root',
  imports: [TicketContainer],
  template: '<app-ticket-container></app-ticket-container>'
})
export class App {}
