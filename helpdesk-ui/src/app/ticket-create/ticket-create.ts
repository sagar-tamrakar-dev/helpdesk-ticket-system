import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Ticket } from '../services/ticket';

@Component({
  selector: 'app-ticket-create',
  imports: [FormsModule, RouterLink],
  templateUrl: './ticket-create.html',
  styleUrl: './ticket-create.css',
})
export class TicketCreate {
  private ticketService = inject(Ticket);
  private router = inject(Router);

  title = '';
  description = '';
  priority = 'MEDIUM';
  error = signal('');

  onSubmit() {
    this.ticketService
      .createTicket({ title: this.title, description: this.description, priority: this.priority })
      .subscribe({
        next: () => this.router.navigate(['/tickets']),
        error: () => this.error.set('Could not create ticket. Check all fields and try again.'),
      });
  }
}