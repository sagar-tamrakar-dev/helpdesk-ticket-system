import { Routes } from '@angular/router';
import { Login } from './login/login';
import { TicketList } from './ticket-list/ticket-list';
import { TicketCreate } from './ticket-create/ticket-create';
import { TicketDetail } from './ticket-detail/ticket-detail';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'tickets', component: TicketList, canActivate: [authGuard] },
  { path: 'tickets/new', component: TicketCreate, canActivate: [authGuard] },
  { path: 'tickets/:id', component: TicketDetail, canActivate: [authGuard] },
  { path: '', redirectTo: 'tickets', pathMatch: 'full' },
];