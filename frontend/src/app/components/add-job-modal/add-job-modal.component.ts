import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { ToastService } from '../../services/toast.service';
import { Job, ALL_STATUSES } from '../../models/job.model';

@Component({
  selector: 'app-add-job-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" *ngIf="open()" (click)="onBg($event)">
      <div class="modal" (click)="$event.stopPropagation()">

        <div class="modal-head">
          <span class="modal-title">{{ editing ? 'Edit Application' : 'Add New Application' }}</span>
          <button class="btn btn-ghost btn-sm" (click)="close()">✕ Close</button>
        </div>

        <div class="modal-body">
          <!-- URL AUTO-FILL -->
          <div class="form-group">
            <label class="form-label">Auto-fill from Job URL</label>
            <div class="url-row">
              <input class="form-input" [(ngModel)]="f.job_url" type="url" placeholder="https://linkedin.com/jobs/…">
              <button class="btn btn-ghost btn-sm" (click)="scrape()" [disabled]="scraping()">
                {{ scraping() ? 'Fetching…' : 'Fetch →' }}
              </button>
            </div>
          </div>
          <div class="divider"></div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Company *</label>
              <input class="form-input" [(ngModel)]="f.company" placeholder="e.g. Google">
            </div>
            <div class="form-group">
              <label class="form-label">Role *</label>
              <input class="form-input" [(ngModel)]="f.role" placeholder="e.g. Software Engineer">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Status</label>
              <select class="form-select" [(ngModel)]="f.status">
                <option *ngFor="let s of statuses" [value]="s">{{ s | titlecase }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Deadline</label>
              <input class="form-input" [(ngModel)]="f.deadline" type="datetime-local">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Contact Name</label>
              <input class="form-input" [(ngModel)]="f.contact_name" placeholder="Recruiter / HR name">
            </div>
            <div class="form-group">
              <label class="form-label">Contact Email</label>
              <input class="form-input" [(ngModel)]="f.contact_email" type="email" placeholder="hr@company.com">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Job Description</label>
            <textarea class="form-textarea" [(ngModel)]="f.job_description" placeholder="Paste the JD here…" style="min-height:90px"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Notes</label>
            <textarea class="form-textarea" [(ngModel)]="f.notes" placeholder="Follow-ups, interview tips, anything…"></textarea>
          </div>
        </div>

        <div class="modal-foot">
          <button class="btn btn-ghost" (click)="close()">Cancel</button>
          <button class="btn btn-primary" (click)="save()" [disabled]="saving()">
            {{ saving() ? 'Saving…' : (editing ? 'Update' : 'Save Application') }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .url-row { display:flex; gap:8px; }
    .url-row .form-input { flex:1; }
    .divider { height:1px; background:var(--border); margin:2px 0 6px; }
  `]
})
export class AddJobModalComponent implements OnInit, OnDestroy {
  open    = signal(false);
  saving  = signal(false);
  scraping = signal(false);
  editing: Job | null = null;
  statuses = ALL_STATUSES;

  f: Partial<Job> = this.blank();

  constructor(private jobSvc: JobService, private toast: ToastService) {}

  ngOnInit()    { document.addEventListener('sh:open', this._handler as EventListener); }
  ngOnDestroy() { document.removeEventListener('sh:open', this._handler as EventListener); }

  _handler = (e: CustomEvent) => {
    this.editing = e.detail;
    this.f = e.detail ? { ...e.detail } : this.blank();
    this.open.set(true);
  };

  blank(): Partial<Job> {
    return { company:'', role:'', status:'applied', job_url:'', job_description:'', notes:'', contact_name:'', contact_email:'', deadline: undefined };
  }

  close() { this.open.set(false); this.editing = null; }

  onBg(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) this.close();
  }

  scrape() {
    if (!this.f.job_url?.trim()) return;
    this.scraping.set(true);
    this.jobSvc.scrapeUrl(this.f.job_url).subscribe({
      next: d => {
        if (d.company) this.f.company = d.company;
        if (d.role) this.f.role = d.role;
        if (d.job_description) this.f.job_description = d.job_description;
        this.scraping.set(false);
        this.toast.success('Job details fetched!');
      },
      error: () => { this.scraping.set(false); this.toast.error('Could not fetch URL'); }
    });
  }

  save() {
    if (!this.f.company?.trim() || !this.f.role?.trim()) {
      this.toast.error('Company and Role are required'); return;
    }
    this.saving.set(true);
    const obs = this.editing
      ? this.jobSvc.update(this.editing.id!, this.f)
      : this.jobSvc.add(this.f);

    obs.subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success(this.editing ? 'Application updated!' : 'Application added!');
        this.close();
      },
      error: () => { this.saving.set(false); this.toast.error('Failed to save'); }
    });
  }
}
