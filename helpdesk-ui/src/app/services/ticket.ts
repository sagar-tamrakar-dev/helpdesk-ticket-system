import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface TicketItem {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  created_by: string;
  assigned_to: number | null;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class Ticket {
  private http = inject(HttpClient);
  private api = 'http://127.0.0.1:8000/api';

  getTickets(filters: { search?: string; status?: string; priority?: string }) {
    let params = new HttpParams();
    if (filters.search) params = params.set('search', filters.search);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.priority) params = params.set('priority', filters.priority);
    return this.http.get<TicketItem[]>(`${this.api}/tickets/`, { params });
  }
}