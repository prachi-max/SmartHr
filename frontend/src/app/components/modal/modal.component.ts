import { Component, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobsService } from '../../services/jobs.service';
import { ModalService } from '../../services/modal.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  company = '';
  role = '';
  status = 'applied';
  jobUrl = '';
  jobJd = '';
  notes = '';
  contactName = '';
  contactEmail = '';

  constructor(
    public modal: ModalService,
    private jobs: JobsService,
    private toast: ToastService
  ) {
    effect(() => {
      const id = this.modal.editingJobId();
      if (this.modal.isOpen()) {
        if (id) {
          const j = this.jobs.jobs().find(x => x.id === id);
          if (j) {
            this.company = j.company || '';
            this.role = j.role || '';
            this.status = j.status;
            this.jobUrl = j.job_url || '';
            this.jobJd = j.job_description || '';
            this.notes = j.notes || '';
            this.contactName = j.contact_name || '';
            this.contactEmail = j.contact_email || '';
          }
        } else {
          this.company = this.role = this.jobUrl = this.jobJd = this.notes = this.contactName = this.contactEmail = '';
          this.status = 'applied';
        }
      }
    });
  }

  get title() {
    return this.modal.editingJobId() ? 'Edit Application' : 'Add New Application';
  }

  scrapeUrl() {
    if (!this.jobUrl) return this.toast.show('Enter a URL first', 'error');
    this.toast.show('Fetching job details...');
    this.jobs.scrapeUrl(this.jobUrl).subscribe({
      next: (data: any) => {
        if (data.company) this.company = data.company;
        if (data.role) this.role = data.role;
        if (data.job_description) this.jobJd = data.job_description;
        this.toast.show('Details fetched!');
      },
      error: () => this.toast.show('Could not scrape URL', 'error')
    });
  }

  save() {
    if (!this.company.trim() || !this.role.trim()) {
      return this.toast.show('Company and Role are required', 'error');
    }
    const payload = {
      company: this.company.trim(),
      role: this.role.trim(),
      status: this.status as any,
      job_url: this.jobUrl || undefined,
      job_description: this.jobJd || undefined,
      notes: this.notes || undefined,
      contact_name: this.contactName || undefined,
      contact_email: this.contactEmail || undefined,
    };
    const id = this.modal.editingJobId();
    const obs = id ? this.jobs.updateJob(id, payload) : this.jobs.createJob(payload);
    obs.subscribe({
      next: () => {
        this.modal.close();
        this.toast.show(id ? 'Application updated!' : 'Application added!');
      },
      error: () => this.toast.show('Failed to save', 'error')
    });
  }
}
