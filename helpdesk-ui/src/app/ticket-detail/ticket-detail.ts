import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Auth } from '../services/auth';
import { StaffUser, Ticket, TicketDetailItem } from '../services/ticket';

// Same rules as the backend ALLOWED_TRANSITIONS
const NEXT_STATUS: Record<string, string[]> = {
  OPEN: ['IN_PROGRESS'],
  IN_PROGRESS: ['RESOLVED'],
  RESOLVED: ['CLOSED', 'IN_PROGRESS'],
  CLOSED: [],
};

@Component({
  selector: 'app-ticket-detail',
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.css',
})
export class TicketDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private ticketService = inject(Ticket);
  private auth = inject(Auth);

  id = Number(this.route.snapshot.paramMap.get('id'));

  ticket = signal<TicketDetailItem | null>(null);
  isStaff = signal(false);
  staff = signal<StaffUser[]>([]);
  error = signal('');

  newComment = '';
  selectedStaff: number | null = null;

  ngOnInit() {
    this.load();
    this.auth.me().subscribe((me) => {
      this.isStaff.set(me.is_staff);
      if (me.is_staff) {
        this.ticketService.getStaff().subscribe((s) => this.staff.set(s));
      }
    });
  }

  load() {
    this.ticketService.getTicket(this.id).subscribe({
      next: (t) => this.ticket.set(t),
      error: () => this.error.set('Ticket not found or you do not have access'),
    });
  }

  nextStatuses() {
    return NEXT_STATUS[this.ticket()?.status ?? ''] ?? [];
  }

  assignedName() {
    const t = this.ticket();
    if (!t || t.assigned_to === null) return 'Not assigned';
    const user = this.staff().find((s) => s.id === t.assigned_to);
    return user ? user.username : 'Assigned';
  }

  addComment() {
    if (!this.newComment.trim()) return;
    this.ticketService.addComment(this.id, this.newComment).subscribe({
      next: () => {
        this.newComment = '';
        this.load();
      },
      error: () => this.error.set('Could not add comment'),
    });
  }

  assign() {
    if (this.selectedStaff === null) return;
    this.ticketService.assign(this.id, this.selectedStaff).subscribe({
      next: () => this.load(),
      error: () => this.error.set('Could not assign ticket'),
    });
  }

  changeStatus(status: string) {
    this.ticketService.changeStatus(this.id, status).subscribe({
      next: () => {
        this.error.set('');
        this.load();
      },
      error: (err) => this.error.set(err.error?.error ?? 'Could not change status'),
    });
  }
}