import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService, AiResult } from '../../services/ai.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-ai',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai.component.html',
  styleUrls: ['./ai.component.css']
})
export class AiComponent {
  jd = '';
  selectedFile: File | null = null;
  loading = signal(false);
  result = signal<AiResult | null>(null);

  constructor(private ai: AiService, private toast: ToastService) {}

  analyze() {

  if (!this.jd.trim()) {
    return this.toast.show('Please enter job description', 'error');
  }

  if (!this.selectedFile) {
    return this.toast.show('Please upload resume', 'error');
  }

  const token = localStorage.getItem('smarthire_token');

  if (!token) {
    return this.toast.show('Please login again', 'error');
  }

  this.loading.set(true);
  this.result.set(null);

  this.ai.analyze(
    this.selectedFile,
    this.jd,
    token
  ).subscribe({
    next: (data) => {
      this.result.set(data);
      this.loading.set(false);
    },
    error: (err) => {
      console.error(err);
      this.loading.set(false);
      this.toast.show('AI analysis failed', 'error');
    }
  });
}

  get scoreColor() {
    const s = this.result()?.match_score ?? 0;
    return s >= 70 ? 'var(--success)' : s >= 40 ? 'var(--warning)' : 'var(--danger)';
  }
  onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];
  }
}
}
