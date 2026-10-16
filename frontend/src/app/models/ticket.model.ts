export type Statut = 'OUVERT' | 'EN_COURS' | 'FERME';

export interface Ticket {
  id: number;
  titre: string;
  description?: string;
  statut: Statut;
  dateCreation: string;
}

export interface TicketRequest {
  titre: string;
  description?: string;
}

export interface ApiError {
  status: number;
  message: string;
  regle?: string;
  champs?: Record<string, string>;
}
