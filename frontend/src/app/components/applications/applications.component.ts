import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../../services/job.service';
import { ToastService } from '../../services/toast.service';
import { Job, JobStatus, STATUS_COLOR } from '../../models/job.model';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <div class="page-title">All Applications</div>
        <div class="page-sub">{{ filtered().length }} of {{ jobSvc.jobs().length }} jobs</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <input class="form-input" [(ngModel)]="search" (ngModelChange)="0"
          placeholder="Search company or role…" style="width:210px">
        <select class="form-select" [(ngModel)]="statusF" style="width:auto;padding:8px 13px">
          <option value="">All Status</option>
          <option value="applied">Applied</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
        <button class="btn btn-primary" (click)="openAdd()">+ Add Job</button>
      </div>
    </div>

    <div class="table-wrap" *ngIf="filtered().length; else noJobs">
      <table>
        <thead>
          <tr>
            <th>Company</th><th>Role</th><th>Status</th>
            <th>Applied</th><th>Contact</th><th>Notes</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let j of filtered()">
            <td style="font-weight:500">{{ j.company }}</td>
            <td style="color:var(--text2)">{{ j.role }}</td>
            <td>
              <span class="badge {{j.status}}">
                <span class="dot" [style.background]="dotColor(j.status)"></span>
                {{ j.status }}
              </span>
            </td>
            <td style="color:var(--text2)">{{ j.applied_date | date:'d MMM y' }}</td>
            <td style="color:var(--text2)">{{ j.contact_name || '—' }}</td>
            <td style="color:var(--text3);font-size:12px;max-width:160px">
              {{ j.notes ? (j.notes | slice:0:50) + (j.notes!.length > 50 ? '…' : '') : '—' }}
            </td>
            <td>
              <div style="display:flex;gap:5px">
                <button class="btn btn-ghost btn-sm" (click)="edit(j)">Edit</button>
                <button class="btn btn-danger btn-sm" (click)="del(j)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ng-template #noJobs>
      <div class="empty">
        <span class="empty-icon">📋</span>
        <h3>No applications found</h3>
        <p *ngIf="jobSvc.jobs().length === 0">Add your first application to get started.</p>
        <p *ngIf="jobSvc.jobs().length > 0">Try clearing the search or filter.</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .dot { width:6px; height:6px; border-radius:50%; display:inline-block; }
  `]
})
export class ApplicationsComponent implements OnInit {
  search  = '';
  statusF = '';

  filtered = computed(() => {
    let jobs = this.jobSvc.jobs();
    if (this.statusF) jobs = jobs.filter(j => j.status === this.statusF);
    const q = this.search.trim().toLowerCase();
    if (q) jobs = jobs.filter(j => j.company.toLowerCase().includes(q) || j.role.toLowerCase().includes(q));
    return jobs;
  });

  constructor(public jobSvc: JobService, private toast: ToastService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(p => { if (p['status']) this.statusF = p['status']; });
  }

  dotColor(s: JobStatus): string { return STATUS_COLOR[s]; }

  edit(j: Job) { document.dispatchEvent(new CustomEvent('sh:open', { detail: j })); }

  del(j: Job) {
    if (!confirm(`Delete "${j.company} – ${j.role}"?`)) return;
    this.jobSvc.delete(j.id!).subscribe({
      next:  () => this.toast.success('Deleted'),
      error: () => this.toast.error('Delete failed')
    });
  }

  openAdd() { document.dispatchEvent(new CustomEvent('sh:open', { detail: null })); }
}
