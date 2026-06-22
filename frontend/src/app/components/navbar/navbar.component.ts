import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="nav">
      <a class="logo" routerLink="/dashboard">Smart<span>Hire</span></a>
      <div class="links">
        <a routerLink="/dashboard"       routerLinkActive="active">Dashboard</a>
        <a routerLink="/kanban"          routerLinkActive="active">Kanban</a>
        <a routerLink="/applications"    routerLinkActive="active">Applications</a>
        <a routerLink="/resume-analyzer" routerLinkActive="active">
          <span class="ai-pill">AI</span> Resume Analyzer
        </a>
      </div>
      <div class="actions">
        <span class="username">{{ auth.currentUser()?.name }}</span>
        <button class="btn btn-primary btn-sm" (click)="openAdd()">+ Add Job</button>
        <button class="btn btn-ghost  btn-sm" (click)="logout()">Sign Out</button>
      </div>
    </nav>
  `,
  styles: [`
    .nav {
      display:flex; align-items:center; justify-content:space-between;
      padding:0 1.5rem; height:60px; background:var(--surface);
      border-bottom:1px solid var(--border); position:sticky; top:0; z-index:200;
    }
    .logo { font-family:'Space Grotesk',sans-serif; font-size:1.2rem; font-weight:700; color:var(--accent); text-decoration:none; }
    .logo span { color:var(--text); }
    .links { display:flex; gap:2px; }
    .links a {
      font-size:13px; font-weight:500; color:var(--text2); text-decoration:none;
      padding:6px 12px; border-radius:7px; transition:all .15s;
      display:flex; align-items:center; gap:5px;
    }
    .links a:hover { background:var(--surface2); color:var(--text); }
    .links a.active { background:rgba(0,212,170,.1); color:var(--accent); }
    .ai-pill { font-size:10px; background:rgba(99,102,241,.2); color:#818cf8; padding:2px 6px; border-radius:8px; font-weight:600; }
    .actions { display:flex; align-items:center; gap:8px; }
    .username { font-size:13px; color:var(--text2); margin-right:4px; }
  `]
})
export class NavbarComponent {
  constructor(public auth: AuthService, private router: Router) {}
  openAdd() { document.dispatchEvent(new CustomEvent('sh:open', { detail: null })); }
  logout()  { this.auth.logout(); this.router.navigate(['/auth']); }
}
