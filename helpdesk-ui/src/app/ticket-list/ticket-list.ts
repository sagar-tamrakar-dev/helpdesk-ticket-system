import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../services/auth';
import { Ticket, TicketItem } from '../services/ticket';

@Component({
  selector: 'app-ticket-list',
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.css',
})
export class TicketList implements OnInit {
  private ticketService = inject(Ticket);
  private auth = inject(Auth);
  private router = inject(Router);

  tickets = signal<TicketItem[]>([]);
  error = signal('');

  search = '';
  status = '';
  priority = '';

  ngOnInit() {
    this.load();
  }

  load() {
    this.ticketService
      .getTickets({ search: this.search, status: this.status, priority: this.priority })
      .subscribe({
        next: (data) => {
          this.tickets.set(data);
          this.error.set('');
        },
        error: (err) => {
          if (err.status === 401) {
            this.logout();
          } else {
            this.error.set('Could not load tickets');
          }
        },
      });
  }

  clearFilters() {
    this.search = '';
    this.status = '';
    this.priority = '';
    this.load();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}