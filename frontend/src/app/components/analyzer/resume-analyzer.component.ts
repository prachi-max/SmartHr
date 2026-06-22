import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resume-analyzer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="analyzer-container">
      <h2>AI Resume Analyzer</h2>

      <!-- Job Description -->
      <div class="field">
        <label>Job Description *</label>
        <textarea
          [(ngModel)]="jobDescription"
          rows="6"
          placeholder="Paste the job description here..."
        ></textarea>
      </div>

      <!-- File Upload -->
      <div class="field">
        <label>Upload Your Resume *</label>
        <div
          class="drop-zone"
          [class.has-file]="selectedFile"
          (dragover)="onDragOver($event)"
          (drop)="onDrop($event)"
          (click)="fileInput.click()"
        >
          <input
            #fileInput
            type="file"
            accept=".pdf,.docx"
            (change)="onFileSelected($event)"
            hidden
          />

          <ng-container *ngIf="!selectedFile">
            <div class="upload-icon">📄</div>
            <p>Click to upload or drag & drop</p>
            <small>PDF or DOCX — max 5MB</small>
          </ng-container>

          <ng-container *ngIf="selectedFile">
            <div class="file-selected">
              <span class="file-icon">{{ selectedFile.name.endsWith('.pdf') ? '📕' : '📘' }}</span>
              <span class="file-name">{{ selectedFile.name }}</span>
              <span class="file-size">({{ (selectedFile.size / 1024).toFixed(1) }} KB)</span>
              <button class="remove-btn" (click)="removeFile($event)">✕</button>
            </div>
          </ng-container>
        </div>
      </div>

      <!-- Error -->
      <div class="error" *ngIf="error">{{ error }}</div>

      <!-- Analyze Button -->
      <button
        class="analyze-btn"
        [disabled]="loading || !selectedFile || !jobDescription"
        (click)="analyze()"
      >
        {{ loading ? 'Analyzing...' : '🔍 Analyze Resume' }}
      </button>

      <!-- Results -->
      <div class="results" *ngIf="result">

        <!-- Match Score -->
        <div class="score-card">
          <div class="score-label">Match Score</div>
          <div class="score-circle" [class]="getScoreClass()">
            {{ result.match_score }}%
          </div>
          <div class="score-bar">
            <div class="score-fill" [style.width]="result.match_score + '%'" [class]="getScoreClass()"></div>
          </div>
        </div>

        <!-- Summary -->
        <div class="summary-card">
          <p>{{ result.summary }}</p>
        </div>

        <!-- Strong Points -->
        <div class="section" *ngIf="result.strong_points?.length">
          <h3>✅ Strong Points</h3>
          <ul>
            <li *ngFor="let point of result.strong_points">{{ point }}</li>
          </ul>
        </div>

        <!-- Missing Keywords -->
        <div class="section" *ngIf="result.missing_keywords?.length">
          <h3>⚠️ Missing Keywords</h3>
          <div class="tags">
            <span class="tag missing" *ngFor="let kw of result.missing_keywords">{{ kw }}</span>
          </div>
        </div>

        <!-- Suggestions -->
        <div class="section" *ngIf="result.suggestions?.length">
          <h3>💡 Suggestions</h3>
          <ul>
            <li *ngFor="let s of result.suggestions">{{ s }}</li>
          </ul>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .analyzer-container { max-width: 720px; margin: 0 auto; padding: 24px; font-family: sans-serif; }
    h2 { margin-bottom: 24px; }
    .field { margin-bottom: 20px; }
    label { display: block; font-weight: 600; margin-bottom: 8px; }
    textarea { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; resize: vertical; box-sizing: border-box; }

    .drop-zone {
      border: 2px dashed #bbb; border-radius: 12px; padding: 40px;
      text-align: center; cursor: pointer; transition: all 0.2s;
      background: #fafafa;
    }
    .drop-zone:hover { border-color: #4f46e5; background: #f0f0ff; }
    .drop-zone.has-file { border-color: #4f46e5; background: #f0f0ff; padding: 20px; }
    .upload-icon { font-size: 40px; margin-bottom: 8px; }
    .drop-zone p { margin: 4px 0; color: #555; }
    .drop-zone small { color: #999; }

    .file-selected { display: flex; align-items: center; gap: 10px; justify-content: center; }
    .file-icon { font-size: 28px; }
    .file-name { font-weight: 600; color: #333; }
    .file-size { color: #888; font-size: 13px; }
    .remove-btn { background: none; border: none; color: #e53e3e; font-size: 18px; cursor: pointer; margin-left: 4px; }

    .error { background: #fff5f5; color: #e53e3e; padding: 12px; border-radius: 8px; margin-bottom: 16px; border: 1px solid #fed7d7; }

    .analyze-btn {
      width: 100%; padding: 14px; background: #4f46e5; color: white;
      border: none; border-radius: 8px; font-size: 16px; font-weight: 600;
      cursor: pointer; transition: background 0.2s;
    }
    .analyze-btn:hover:not(:disabled) { background: #3730a3; }
    .analyze-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .results { margin-top: 32px; }

    .score-card { text-align: center; margin-bottom: 24px; }
    .score-label { font-size: 13px; color: #888; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
    .score-circle {
      display: inline-flex; align-items: center; justify-content: center;
      width: 100px; height: 100px; border-radius: 50%; font-size: 28px;
      font-weight: 700; margin-bottom: 12px;
    }
    .score-circle.high { background: #c6f6d5; color: #276749; }
    .score-circle.medium { background: #fefcbf; color: #744210; }
    .score-circle.low { background: #fed7d7; color: #9b2c2c; }
    .score-bar { height: 8px; background: #eee; border-radius: 4px; overflow: hidden; width: 300px; margin: 0 auto; }
    .score-fill { height: 100%; border-radius: 4px; transition: width 0.8s ease; }
    .score-fill.high { background: #38a169; }
    .score-fill.medium { background: #d69e2e; }
    .score-fill.low { background: #e53e3e; }

    .summary-card { background: #ebf4ff; border-left: 4px solid #4299e1; padding: 16px; border-radius: 8px; margin-bottom: 24px; color: #2b6cb0; }

    .section { margin-bottom: 24px; }
    .section h3 { margin-bottom: 12px; font-size: 16px; }
    ul { padding-left: 20px; line-height: 1.8; color: #444; }

    .tags { display: flex; flex-wrap: wrap; gap: 8px; }
    .tag { padding: 4px 12px; border-radius: 20px; font-size: 13px; }
    .tag.missing { background: #fff5f5; color: #e53e3e; border: 1px solid #fed7d7; }
  `]
})
export class ResumeAnalyzerComponent {
  selectedFile: File | null = null;
  jobDescription = '';
  loading = false;
  error = '';
  result: any = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.setFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files[0]) {
      this.setFile(files[0]);
    }
  }

  setFile(file: File) {
    const name = file.name.toLowerCase();
    if (!name.endsWith('.pdf') && !name.endsWith('.docx')) {
      this.error = 'Only PDF and DOCX files are supported.';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.error = 'File is too large. Maximum size is 5MB.';
      return;
    }
    this.error = '';
    this.selectedFile = file;
    this.result = null;

  }

  removeFile(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.result = null;
  }

  analyze() {
    if (!this.selectedFile || !this.jobDescription) return;
    this.loading = true;
    this.error = '';
    this.result = null;

   const token = localStorage.getItem('smarthire_token');
   console.log('selectedFile = ', this.selectedFile);
   console.log('jobDescription = ', this.jobDescription);
const formData = new FormData();
formData.append('file', this.selectedFile!, this.selectedFile!.name);
formData.append('job_description', this.jobDescription);

console.log('Token:', token);
console.log('File:', this.selectedFile);
console.log('Job Description:', this.jobDescription);

for (const pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}

this.http.post(
  'http://localhost:8000/api/ai/analyze',
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.detail || 'Analysis failed. Please try again.';
        this.loading = false;
      }
    });
  }

  getScoreClass() {
    if (!this.result) return '';
    if (this.result.match_score >= 70) return 'high';
    if (this.result.match_score >= 40) return 'medium';
    return 'low';
  }
}
