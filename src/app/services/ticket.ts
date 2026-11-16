import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ---------------------------------------------------------------------------
// Ticket data model (mirrors the Laravel ticket table)
export interface Ticket {
  id: number;
  user_id: number;
  category_id: number;
  assigned_to: number | null;

  subject: string;
  description: string;
  priority: string;
  status: string;

  created_at?: string;
  updated_at?: string;
  escalated_at?: string | null;

  ai_suggested_category?: string | null;
  ai_suggested_priority?: string | null;
  ai_summary?: string | null;
  ai_analysis_status?: string;
}

// ---------------------------------------------------------------------------
// Generic API response wrapper used by the Laravel backend
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ---------------------------------------------------------------------------
// Service that talks to the Laravel API
@Injectable({
  providedIn: 'root',
})
export class TicketService {
  // Base URL – adjust if your API runs on a different host/port
  private apiUrl = 'http://127.0.0.1:8000/api/tickets';

  constructor(private http: HttpClient) {}

  // ------------------- CRUD operations ------------------------------------

  // GET /api/tickets – list all tickets
  getTickets(): Observable<ApiResponse<Ticket[]>> {
    return this.http.get<ApiResponse<Ticket[]>>(this.apiUrl);
  }

  // POST /api/tickets – create a new ticket
  createTicket(ticketData: Partial<Ticket>): Observable<ApiResponse<Ticket>> {
    return this.http.post<ApiResponse<Ticket>>(this.apiUrl, ticketData);
  }

  // PUT /api/tickets/{id} – update an existing ticket
  updateTicket(
    id: number,
    ticketData: Partial<Ticket>
  ): Observable<ApiResponse<Ticket>> {
    return this.http.put<ApiResponse<Ticket>>(`${this.apiUrl}/${id}`, ticketData);
  }

  // DELETE /api/tickets/{id} – delete a ticket
  deleteTicket(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }

  // GET /api/tickets/{id} – fetch a single ticket (used for the View button)
  getTicket(id: number): Observable<ApiResponse<Ticket>> {
    return this.http.get<ApiResponse<Ticket>>(`${this.apiUrl}/${id}`);
  }
} // <‑‑ **Closing brace added**