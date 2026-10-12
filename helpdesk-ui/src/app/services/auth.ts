import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Auth {
  private http = inject(HttpClient);
  private api = 'http://127.0.0.1:8000/api';

  login(username: string, password: string) {
    return this.http
      .post<{ access: string; refresh: string }>(`${this.api}/login/`, { username, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('access', res.access);
          localStorage.setItem('refresh', res.refresh);
        })
      );
  }

  me() {
    return this.http.get<{ id: number; username: string; is_staff: boolean }>(`${this.api}/me/`);
  }

  logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }

  isLoggedIn() {
    return !!localStorage.getItem('access');
  }
}