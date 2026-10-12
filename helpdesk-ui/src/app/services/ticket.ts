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

export interface CommentItem {
  id: number;
  text: string;
  user: string;
  created_at: string;
}

export interface TicketDetailItem extends TicketItem {
  comments: CommentItem[];
}

export interface StaffUser {
  id: number;
  username: string;
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

  createTicket(data: { title: string; description: string; priority: string }) {
    return this.http.post<TicketItem>(`${this.api}/tickets/`, data);
  }
  
  getTicket(id: number) {
    return this.http.get<TicketDetailItem>(`${this.api}/tickets/${id}/`);
  }

  addComment(id: number, text: string) {
    return this.http.post(`${this.api}/tickets/${id}/comment/`, { text });
  }

  assign(id: number, userId: number) {
    return this.http.post(`${this.api}/tickets/${id}/assign/`, { user_id: userId });
  }

  changeStatus(id: number, status: string) {
    return this.http.post(`${this.api}/tickets/${id}/change_status/`, { status });
  }

  getStaff() {
    return this.http.get<StaffUser[]>(`${this.api}/staff/`);
  }
}