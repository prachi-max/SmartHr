import { Component, computed } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobService } from '../../services/job.service';
import { Job, ALL_STATUSES, STATUS_COLOR, JobStatus } from '../../models/job.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TitleCasePipe],
  template: `
    <div class="page-header">
      <div>
        <div class="page-title">Dashboard</div>
        <div class="page-sub">Your job search at a glance</div>
      </div>
      <button class="btn btn-primary" (click)="openAdd()">+ Add Job</button>
    </div>

    <!-- STATS -->
    <div class="stats-grid">
      <div class="stat" *ngFor="let s of statCards()" [routerLink]="s.link" [queryParams]="s.qp">
        <div class="stat-label">{{ s.label }}</div>
        <div class="stat-val" [style.color]="s.color">{{ s.val }}</div>
      </div>
    </div>

    <!-- PIPELINE CHART -->
    <div class="card" style="margin-bottom:1.5rem">
      <div class="sec-title">Application Pipeline</div>
      <div class="chart">
        <div class="bars">
          <div class="bar-col" *ngFor="let b of chartBars()">
            <span class="bar-num" [style.color]="b.color">{{ b.n }}</span>
            <div class="bar-fill" [style.height.%]="b.h" [style.background]="b.color"></div>
          </div>
        </div>
        <div class="bar-labels">
          <span *ngFor="let b of chartBars()">{{ b.label }}</span>
        </div>
      </div>
    </div>

    <!-- RECENT -->
    <div class="card">
      <div class="sec-title" style="margin-bottom:1rem">Recent Applications</div>
      <div class="no-jobs" *ngIf="!recent().length">
        No applications yet.
        <a routerLink="/applications">Add your first one →</a>
      </div>
      <div class="recent-row" *ngFor="let j of recent()">
        <div>
          <div class="rc-co">{{ j.company }}</div>
          <div class="rc-role">{{ j.role }}</div>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <span class="badge {{j.status}}">{{ j.status }}</span>
          <span class="rc-date">{{ j.applied_date | date:'d MMM' }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid {
      display:grid; grid-template-columns:repeat(5,1fr); gap:12px; margin-bottom:1.5rem;
    }
    .stat {
      background:var(--surface); border:1px solid var(--border); border-radius:12px;
      padding:1rem 1.2rem; cursor:pointer; transition:border-color .15s; text-decoration:none; display:block;
    }
    .stat:hover { border-color:var(--accent); }
    .stat-label { font-size:11px; color:var(--text2); font-weight:600; text-transform:uppercase; letter-spacing:.5px; margin-bottom:8px; }
    .stat-val   { font-family:'Space Grotesk',sans-serif; font-size:1.75rem; font-weight:700; }
    .sec-title  { font-size:11px; font-weight:600; color:var(--text2); text-transform:uppercase; letter-spacing:.5px; }
    .chart      { margin-top:1rem; }
    .bars       { display:flex; gap:8px; align-items:flex-end; height:110px; }
    .bar-col    { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; gap:6px; }
    .bar-num    { font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:600; }
    .bar-fill   { width:100%; border-radius:5px 5px 0 0; opacity:.85; min-height:4px; transition:height .4s ease; }
    .bar-labels { display:flex; gap:8px; margin-top:6px; }
    .bar-labels span { flex:1; text-align:center; font-size:11px; color:var(--text3); text-transform:capitalize; }
    .no-jobs    { font-size:13px; color:var(--text2); }
    .no-jobs a  { color:var(--accent); text-decoration:none; }
    .recent-row {
      display:flex; align-items:center; justify-content:space-between;
      padding:10px 0; border-bottom:1px solid var(--border);
    }
    .recent-row:last-child { border-bottom:none; }
    .rc-co   { font-size:13px; font-weight:500; }
    .rc-role { font-size:12px; color:var(--text2); margin-top:2px; }
    .rc-date { font-size:12px; color:var(--text3); }
  `]
})
export class DashboardComponent {
  constructor(public jobSvc: JobService) {}

  statCards = computed(() => {
    const s = this.jobSvc.stats();
    return [
      { label:'Total Applied', val:s.total,     color:'var(--text)',           link:'/applications', qp:{} },
      { label:'Applied',       val:s.applied,    color:STATUS_COLOR.applied,    link:'/applications', qp:{status:'applied'} },
      { label:'Interviews',    val:s.interview,  color:STATUS_COLOR.interview,  link:'/applications', qp:{status:'interview'} },
      { label:'Offers',        val:s.offer,      color:STATUS_COLOR.offer,      link:'/applications', qp:{status:'offer'} },
      { label:'Rejected',      val:s.rejected,   color:STATUS_COLOR.rejected,   link:'/applications', qp:{status:'rejected'} },
    ];
  });

  chartBars = computed(() => {
    const s = this.jobSvc.stats();
    const max = Math.max(s.applied, s.shortlisted, s.interview, s.offer, s.rejected, 1);
    return ALL_STATUSES.map(key => ({
      label: key,
      n:     (s as any)[key] as number,
      color: STATUS_COLOR[key],
      h:     Math.max(((s as any)[key] / max) * 100, 4),
    }));
  });

  recent = computed(() => this.jobSvc.jobs().slice(0, 5));

  openAdd() { document.dispatchEvent(new CustomEvent('sh:open', { detail: null })); }
}
