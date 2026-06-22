import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService } from '../../services/job.service';
import { ToastService } from '../../services/toast.service';
import { Job, ALL_STATUSES, STATUS_COLOR, JobStatus } from '../../models/job.model';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div>
        <div class="page-title">Kanban Board</div>
        <div class="page-sub">Your pipeline across all stages</div>
      </div>
      <button class="btn btn-primary" (click)="openAdd()">+ Add Job</button>
    </div>

    <div class="board">
      <div class="col" *ngFor="let st of statuses">
        <div class="col-head">
          <div class="col-label">
            <span class="dot" [style.background]="colors[st]"></span>
            {{ st | titlecase }}
          </div>
          <span class="col-count">{{ getJobs(st).length }}</span>
        </div>
        <div class="col-body">
          <div class="jcard" *ngFor="let j of getJobs(st)" (click)="edit(j)">
            <div class="jco">{{ j.company }}</div>
            <div class="jrole">{{ j.role }}</div>
            <div class="jmeta">
              <span>{{ j.applied_date | date:'d MMM' }}</span>
              <span *ngIf="j.contact_name"> · {{ j.contact_name }}</span>
            </div>
            <div class="jactions" (click)="$event.stopPropagation()">
              <button class="btn btn-ghost btn-sm" (click)="edit(j)">Edit</button>
              <button class="btn btn-danger btn-sm" (click)="del(j)">Delete</button>
            </div>
          </div>
          <div class="col-empty" *ngIf="!getJobs(st).length">No jobs here</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .board { display:grid; grid-template-columns:repeat(5,1fr); gap:12px; align-items:start; }
    .col   { background:var(--surface); border:1px solid var(--border); border-radius:12px; overflow:hidden; }
    .col-head {
      padding:12px 14px; font-size:12px; font-weight:600;
      display:flex; align-items:center; justify-content:space-between;
      border-bottom:1px solid var(--border);
    }
    .col-label { display:flex; align-items:center; gap:7px; text-transform:capitalize; }
    .dot       { width:8px; height:8px; border-radius:50%; }
    .col-count { font-size:11px; background:var(--surface2); padding:1px 7px; border-radius:10px; color:var(--text2); }
    .col-body  { padding:10px; display:flex; flex-direction:column; gap:8px; min-height:80px; }
    .jcard {
      background:var(--surface2); border:1px solid var(--border); border-radius:9px;
      padding:12px; cursor:pointer; transition:all .15s;
    }
    .jcard:hover  { border-color:var(--accent); transform:translateY(-1px); }
    .jco          { font-size:13px; font-weight:600; margin-bottom:2px; }
    .jrole        { font-size:12px; color:var(--text2); margin-bottom:7px; }
    .jmeta        { font-size:11px; color:var(--text3); margin-bottom:8px; }
    .jactions     { display:flex; gap:5px; }
    .col-empty    { text-align:center; padding:1rem; font-size:12px; color:var(--text3); }
  `]
})
export class KanbanComponent {
  statuses = ALL_STATUSES;
  colors   = STATUS_COLOR;

  constructor(private jobSvc: JobService, private toast: ToastService) {}

  getJobs(st: JobStatus): Job[] { return this.jobSvc.jobs().filter(j => j.status === st); }

  edit(j: Job) { document.dispatchEvent(new CustomEvent('sh:open', { detail: j })); }

  del(j: Job) {
    if (!confirm(`Delete "${j.company} – ${j.role}"?`)) return;
    this.jobSvc.delete(j.id!).subscribe({
      next: ()  => this.toast.success('Deleted'),
      error: () => this.toast.error('Delete failed')
    });
  }

  openAdd() { document.dispatchEvent(new CustomEvent('sh:open', { detail: null })); }
}
