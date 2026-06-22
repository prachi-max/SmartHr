import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/job.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'https://smarthr-9d4i.onrender.com/api';

  token       = signal<string | null>(localStorage.getItem('sh_token'));
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient) {
    if (this.token()) this.loadMe().subscribe({ error: () => this.logout() });
  }

  login(email: string, password: string): Observable<any> {
    const fd = new FormData();
    fd.append('username', email);
    fd.append('password', password);
    return this.http.post<any>(`${this.API}/users/login`, fd).pipe(
      tap(r => { this.token.set(r.access_token); localStorage.setItem('sh_token', r.access_token); })
    );
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.API}/users/register`, { name, email, password });
  }

  loadMe(): Observable<User> {
    return this.http.get<User>(`${this.API}/users/me`).pipe(
      tap(u => this.currentUser.set(u))
    );
  }

  logout() {
    this.token.set(null);
    this.currentUser.set(null);
    localStorage.removeItem('sh_token');
  }

  isLoggedIn(): boolean { return !!this.token(); }
}
