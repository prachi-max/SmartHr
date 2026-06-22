import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sb">
      <div class="sb-section">Workspace</div>

      <a class="sb-item" routerLink="/dashboard" routerLinkActive="active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
        Dashboard
      </a>

      <a class="sb-item" routerLink="/kanban" routerLinkActive="active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="5" height="18" rx="1"/>
          <rect x="10" y="3" width="5" height="12" rx="1"/>
          <rect x="17" y="3" width="4" height="15" rx="1"/>
        </svg>
        Kanban Board
        <span class="sb-badge">{{ jobs.stats().total }}</span>
      </a>

      <a class="sb-item" routerLink="/applications" routerLinkActive="active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
          <line x1="8" y1="18" x2="21" y2="18"/>
          <circle cx="3" cy="6" r="1.5"/><circle cx="3" cy="12" r="1.5"/><circle cx="3" cy="18" r="1.5"/>
        </svg>
        All Applications
      </a>

      <div class="sb-section" style="margin-top:8px">AI Tools</div>

      <a class="sb-item" routerLink="/resume-analyzer" routerLinkActive="active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 0 6h-1v1a4 4 0 0 1-8 0v-1H7a3 3 0 0 1 0-6h1V6a4 4 0 0 1 4-4z"/>
        </svg>
        Resume Analyzer
        <span class="sb-badge ai">AI</span>
      </a>
    </aside>
  `,
  styles: [`
    .sb {
      background:var(--surface); border-right:1px solid var(--border);
      padding:1.5rem .75rem; display:flex; flex-direction:column; gap:2px;
    }
    .sb-section {
      font-size:10px; font-weight:600; color:var(--text3); text-transform:uppercase;
      letter-spacing:1px; padding:10px 12px 5px;
    }
    .sb-item {
      display:flex; align-items:center; gap:9px; padding:9px 12px; border-radius:8px;
      font-size:13px; font-weight:500; color:var(--text2); cursor:pointer;
      transition:all .15s; text-decoration:none;
    }
    .sb-item:hover  { background:var(--surface2); color:var(--text); }
    .sb-item.active { background:rgba(0,212,170,.1); color:var(--accent); }
    .sb-item svg    { width:16px; height:16px; flex-shrink:0; }
    .sb-badge {
      margin-left:auto; background:var(--surface2); color:var(--text2);
      font-size:11px; padding:1px 7px; border-radius:10px;
    }
    .sb-badge.ai { background:rgba(99,102,241,.2); color:#818cf8; }
    .sb-item.active .sb-badge { background:rgba(0,212,170,.2); color:var(--accent); }
  `]
})
export class SidebarComponent { constructor(public jobs: JobService) {} }
