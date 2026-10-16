import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiError, Statut, Ticket, TicketRequest } from '../models/ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketService {

  private readonly baseUrl = 'http://localhost:8080/api/tickets';

  constructor(private http: HttpClient) {}

  lister(statut: Statut | null): Observable<Ticket[]> {
    let params = new HttpParams();
    if (statut) params = params.set('statut', statut);
    return this.http.get<Ticket[]>(this.baseUrl, { params })
      .pipe(catchError(this.handleError));
  }

  creer(payload: TicketRequest): Observable<Ticket> {
    return this.http.post<Ticket>(this.baseUrl, payload)
      .pipe(catchError(this.handleError));
  }

  fermer(id: number): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.baseUrl}/${id}/fermer`, {})
      .pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse) {
    const apiError: ApiError = {
      status: err.status,
      message: 'Le serveur est injoignable.'
    };

    // Cas 1 : serveur injoignable
    if (err.status === 0) {
      apiError.message = 'Le serveur est injoignable. Vérifiez que le backend est démarré.';
      return throwError(() => apiError);
    }

    const body = err.error;

    // Cas 2 : réponse JSON du serveur
    if (body && typeof body === 'object') {

      // 400 : messages de validation par champ (priorité)
      if (body.champs && typeof body.champs === 'object') {
        const messages = Object.values(body.champs) as string[];
        if (messages.length > 0) {
          apiError.message = messages.join(' ');
          apiError.champs = body.champs;
          return throwError(() => apiError);
        }
      }

      // 409, 404, etc.
      if (typeof body.message === 'string') {
        apiError.message = body.message;
      }
      if (typeof body.regle === 'string') {
        apiError.regle = body.regle;
      }
      if (body.champs) {
        apiError.champs = body.champs;
      }
    }

    return throwError(() => apiError);
  }
}
