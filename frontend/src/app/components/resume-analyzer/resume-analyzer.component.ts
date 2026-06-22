import { Component, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { ToastService } from '../../services/toast.service';
import { ResumeAnalysis } from '../../models/job.model';

@Component({
  selector: 'app-resume-analyzer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <div class="page-title">Resume Analyzer</div>
        <div class="page-sub">Upload your PDF resume or paste text — AI shows what's missing</div>
      </div>
    </div>

    <div class="ra-grid">
      <!-- LEFT: INPUTS -->
      <div class="ra-left">

        <!-- JD -->
        <div class="card" style="margin-bottom:1rem">
          <div class="section-head">
            Job Description
            <span class="step-pill">Step 1</span>
          </div>
          <textarea class="form-textarea" [(ngModel)]="jd"
            placeholder="Paste the full job description here…"
            style="min-height:160px"></textarea>
        </div>

        <!-- RESUME -->
        <div class="card">
          <div class="section-head">
            Your Resume
            <span class="step-pill">Step 2</span>
          </div>

          <!-- UPLOAD TABS -->
          <div class="upload-tabs">
            <div class="utab" [class.active]="inputMode()==='pdf'"  (click)="inputMode.set('pdf')">
              📄 Upload PDF
            </div>
            <div class="utab" [class.active]="inputMode()==='text'" (click)="inputMode.set('text')">
              ✏️ Paste Text
            </div>
          </div>

          <!-- PDF UPLOAD -->
          <ng-container *ngIf="inputMode()==='pdf'">
            <div class="drop-zone"
              [class.has-file]="pdfName()"
              [class.drag-over]="dragging()"
              (click)="fileInput.click()"
              (dragover)="$event.preventDefault(); dragging.set(true)"
              (dragleave)="dragging.set(false)"
              (drop)="onDrop($event)">
              <input #fileInput type="file" accept=".pdf" style="display:none" (change)="onFileChange($event)">

              <ng-container *ngIf="!pdfName()">
                <div class="dz-icon">📁</div>
                <div class="dz-text">Drop your PDF here or <span class="dz-link">browse</span></div>
                <div class="dz-hint">PDF files only · Max 10 MB</div>
              </ng-container>

              <ng-container *ngIf="pdfName()">
                <div class="dz-icon">✅</div>
                <div class="dz-text" style="color:var(--success)">{{ pdfName() }}</div>
                <div class="dz-hint">Click to replace</div>
              </ng-container>
            </div>

            <div class="pdf-extract-status" *ngIf="extracting()">
              <div class="spinner" style="width:20px;height:20px;border-width:2px;margin:0"></div>
              Extracting text from PDF…
            </div>
            <div class="pdf-extract-status success" *ngIf="resumeText && !extracting()">
              ✓ {{ wordCount() }} words extracted — ready to analyze
            </div>
          </ng-container>

          <!-- TEXT PASTE -->
          <ng-container *ngIf="inputMode()==='text'">
            <textarea class="form-textarea" [(ngModel)]="resumeText"
              placeholder="Paste your resume text here…"
              style="min-height:200px"></textarea>
          </ng-container>

          <button class="btn btn-primary btn-full" style="margin-top:1rem"
            (click)="analyze()" [disabled]="analyzing()">
            {{ analyzing() ? 'Analyzing with Gemini AI…' : 'Analyze with AI →' }}
          </button>
        </div>
      </div>

      <!-- RIGHT: RESULTS -->
      <div class="ra-right">
        <div class="card result-card">
          <div class="section-head">AI Analysis</div>

          <!-- PLACEHOLDER -->
          <div class="ra-placeholder" *ngIf="!analyzing() && !result()">
            <div class="ph-icon">🤖</div>
            <p>Fill in the job description and your resume on the left, then click <strong>Analyze with AI</strong>.</p>
            <ul>
              <li>Score your resume match (0–100)</li>
              <li>List missing keywords</li>
              <li>Highlight strong points</li>
              <li>Give specific improvement tips</li>
            </ul>
          </div>

          <!-- LOADING -->
          <div class="ra-loading" *ngIf="analyzing()">
            <div class="spinner"></div>
            <p>Analyzing your resume against the job description…</p>
          </div>

          <!-- RESULTS -->
          <ng-container *ngIf="result() && !analyzing()">
            <!-- SCORE -->
            <div class="score-wrap">
              <div class="score-ring"
                [style.border-color]="scoreColor()"
                [style.color]="scoreColor()">
                {{ result()!.match_score }}%
              </div>
              <div class="score-summary">{{ result()!.summary }}</div>
            </div>

            <!-- MISSING KEYWORDS -->
            <div class="ra-section" *ngIf="result()!.missing_keywords?.length">
              <div class="ra-sec-title">Missing Keywords</div>
              <div class="pill-row">
                <span class="pill red" *ngFor="let k of result()!.missing_keywords">{{ k }}</span>
              </div>
            </div>

            <!-- STRONG POINTS -->
            <div class="ra-section" *ngIf="result()!.strong_points?.length">
              <div class="ra-sec-title">Your Strong Points</div>
              <div class="pill-row">
                <span class="pill green" *ngFor="let k of result()!.strong_points">{{ k }}</span>
              </div>
            </div>

            <!-- SUGGESTIONS -->
            <div class="ra-section" *ngIf="result()!.suggestions?.length">
              <div class="ra-sec-title">Improvement Suggestions</div>
              <div class="suggestion" *ngFor="let s of result()!.suggestions">
                <span class="arrow">→</span> {{ s }}
              </div>
            </div>

            <button class="btn btn-ghost btn-full" style="margin-top:1rem" (click)="result.set(null)">
              Clear Results
            </button>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ra-grid  { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; align-items:start; }
    .ra-left  { display:flex; flex-direction:column; }
    .ra-right { position:sticky; top:76px; }
    .result-card { min-height:400px; }

    .section-head {
      display:flex; align-items:center; gap:8px;
      font-family:'Space Grotesk',sans-serif; font-size:14px; font-weight:600;
      margin-bottom:1rem;
    }
    .step-pill {
      font-size:10px; background:rgba(99,102,241,.2); color:#818cf8;
      padding:2px 8px; border-radius:10px; font-weight:600; font-family:'Inter',sans-serif;
    }

    .upload-tabs {
      display:flex; background:var(--surface2); border-radius:8px; padding:3px; margin-bottom:.9rem;
    }
    .utab {
      flex:1; text-align:center; padding:7px 8px; border-radius:6px; font-size:13px;
      font-weight:500; cursor:pointer; color:var(--text2); transition:all .15s;
    }
    .utab.active { background:var(--accent); color:#0a0f1e; }

    .drop-zone {
      border:2px dashed var(--border); border-radius:10px; padding:2rem 1rem;
      text-align:center; cursor:pointer; transition:all .2s;
    }
    .drop-zone:hover, .drop-zone.drag-over { border-color:var(--accent); background:rgba(0,212,170,.04); }
    .drop-zone.has-file { border-color:var(--success); border-style:solid; }
    .dz-icon  { font-size:2rem; margin-bottom:.5rem; }
    .dz-text  { font-size:14px; font-weight:500; color:var(--text); margin-bottom:4px; }
    .dz-link  { color:var(--accent); }
    .dz-hint  { font-size:12px; color:var(--text3); }

    .pdf-extract-status {
      display:flex; align-items:center; gap:8px; font-size:12px; color:var(--text2);
      margin-top:.6rem; padding:8px 12px; background:var(--surface2);
      border-radius:8px; border:1px solid var(--border);
    }
    .pdf-extract-status.success { color:var(--success); border-color:rgba(16,185,129,.3); background:rgba(16,185,129,.06); }

    /* RESULT STYLES */
    .ra-placeholder { color:var(--text2); font-size:13px; line-height:1.7; padding:1rem 0; }
    .ra-placeholder .ph-icon { font-size:2rem; margin-bottom:.75rem; }
    .ra-placeholder p   { margin-bottom:.75rem; }
    .ra-placeholder ul  { padding-left:1.2rem; display:flex; flex-direction:column; gap:4px; }

    .ra-loading { text-align:center; padding:2rem; color:var(--text2); }
    .ra-loading p { font-size:13px; margin-top:.5rem; }

    .score-wrap    { text-align:center; margin-bottom:1.5rem; }
    .score-ring    {
      width:100px; height:100px; border-radius:50%; display:flex;
      align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif;
      font-size:1.5rem; font-weight:700; border:4px solid; margin:0 auto 1rem;
    }
    .score-summary { font-size:13px; color:var(--text2); line-height:1.5; }

    .ra-section   { margin-bottom:1.25rem; }
    .ra-sec-title { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.5px; color:var(--text2); margin-bottom:8px; }

    .pill-row { display:flex; flex-wrap:wrap; gap:5px; }
    .pill     { font-size:12px; padding:3px 10px; border-radius:20px; }
    .pill.red   { background:rgba(239,68,68,.1);  color:#f87171; border:1px solid rgba(239,68,68,.2); }
    .pill.green { background:rgba(16,185,129,.1); color:#34d399; border:1px solid rgba(16,185,129,.2); }

    .suggestion { font-size:13px; color:var(--text2); padding:7px 0; border-bottom:1px solid var(--border); line-height:1.5; display:flex; gap:6px; }
    .suggestion:last-child { border-bottom:none; }
    .arrow { color:var(--accent); flex-shrink:0; }
  `]
})
export class ResumeAnalyzerComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  inputMode  = signal<'pdf' | 'text'>('pdf');
  dragging   = signal(false);
  extracting = signal(false);
  analyzing  = signal(false);
  pdfName    = signal('');
  result     = signal<ResumeAnalysis | null>(null);

  jd         = '';
  resumeText = '';

  constructor(private jobSvc: JobService, private toast: ToastService) {}

  wordCount(): number {
    return this.resumeText.trim().split(/\s+/).filter(Boolean).length;
  }

  scoreColor(): string {
    const s = this.result()!.match_score;
    if (s >= 70) return 'var(--success)';
    if (s >= 40) return 'var(--warning)';
    return 'var(--danger)';
  }

  // ── DRAG & DROP ──────────────────────────────
  onDrop(e: DragEvent) {
    e.preventDefault();
    this.dragging.set(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) this.processFile(file);
  }

  onFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) this.processFile(file);
  }

  // ── PDF TEXT EXTRACTION via pdf.js CDN ───────
  processFile(file: File) {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      this.toast.error('Please upload a PDF file'); return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.toast.error('File too large (max 10 MB)'); return;
    }

    this.pdfName.set(file.name);
    this.resumeText = '';
    this.extracting.set(true);

    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const arrayBuffer = ev.target!.result as ArrayBuffer;
        const text = await this.extractTextFromPdf(arrayBuffer);
        if (!text.trim()) {
          this.toast.error('Could not extract text — try pasting manually');
          this.inputMode.set('text');
        } else {
          this.resumeText = text;
          this.toast.success(`Extracted ${this.wordCount()} words from PDF`);
        }
      } catch (err) {
        this.toast.error('PDF extraction failed — try pasting text manually');
        this.inputMode.set('text');
      } finally {
        this.extracting.set(false);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  private async extractTextFromPdf(buffer: ArrayBuffer): Promise<string> {
    // Dynamically load pdf.js from CDN if not loaded
    if (!(window as any).pdfjsLib) {
      await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
      (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    const pdfjsLib = (window as any).pdfjsLib;
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page    = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) { resolve(); return; }
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(s);
    });
  }

  // ── ANALYZE ───────────────────────────────────
  analyze() {
    if (!this.jd.trim()) {
      this.toast.error('Please paste the job description'); return;
    }
    if (!this.resumeText.trim()) {
      this.toast.error(
        this.inputMode() === 'pdf'
          ? 'Please upload a PDF first'
          : 'Please paste your resume text'
      );
      return;
    }

    this.analyzing.set(true);
    this.result.set(null);

    this.jobSvc.analyzeResume(this.resumeText, this.jd).subscribe({
      next: (r) => {
        this.result.set(r);
        this.analyzing.set(false);
        this.toast.success('Analysis complete!');
      },
      error: (e) => {
        this.analyzing.set(false);
        const msg = e.error?.detail || 'AI analysis failed';
        this.toast.error(msg);
        // Show error in result area
        this.result.set({
          match_score: 0,
          summary: msg,
          missing_keywords: [],
          strong_points: [],
          suggestions: ['Check that the Gemini API key is set in backend/.env', 'Ensure the backend is running on port 8000'],
        });
      }
    });
  }
}
