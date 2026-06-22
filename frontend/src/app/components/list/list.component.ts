import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { JobsService } from '../../services/jobs.service';
import { ModalService } from '../../services/modal.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  statusFilter = signal('');

  filteredJobs = computed(() => {
    const f = this.statusFilter();
    return f ? this.jobs.jobs().filter(j => j.status === f) : this.jobs.jobs();
  });

  subtitle = computed(() =>
    this.statusFilter() ? `Showing: ${this.statusFilter()}` : 'Showing all jobs'
  );

  constructor(
    public jobs: JobsService,
    public modal: ModalService,
    private toast: ToastService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.statusFilter.set(params['status'] || '');
    });
  }

  formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  deleteJob(id: number) {
    if (!confirm('Delete this application?')) return;
    this.jobs.deleteJob(id).subscribe({
      next: () => this.toast.show('Application deleted'),
      error: () => this.toast.show('Delete failed', 'error')
    });
  }
}
