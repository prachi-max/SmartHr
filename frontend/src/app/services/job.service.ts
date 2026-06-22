import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Job, ResumeAnalysis } from '../models/job.model';

@Injectable({ providedIn: 'root' })
export class JobService {
  private readonly API = 'http://localhost:8000/api';

  jobs = signal<Job[]>([]);

  stats = computed(() => {
    const j = this.jobs();
    return {
      total:       j.length,
      applied:     j.filter(x => x.status === 'applied').length,
      shortlisted: j.filter(x => x.status === 'shortlisted').length,
      interview:   j.filter(x => x.status === 'interview').length,
      offer:       j.filter(x => x.status === 'offer').length,
      rejected:    j.filter(x => x.status === 'rejected').length,
    };
  });

  constructor(private http: HttpClient) {}

  load(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.API}/jobs/`).pipe(
      tap(jobs => this.jobs.set(jobs))
    );
  }

  add(payload: Partial<Job>): Observable<Job> {
    return this.http.post<Job>(`${this.API}/jobs/`, payload).pipe(
      tap(j => this.jobs.update(list => [j, ...list]))
    );
  }

  update(id: number, payload: Partial<Job>): Observable<Job> {
    return this.http.put<Job>(`${this.API}/jobs/${id}`, payload).pipe(
      tap(j => this.jobs.update(list => list.map(x => x.id === id ? j : x)))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/jobs/${id}`).pipe(
      tap(() => this.jobs.update(list => list.filter(x => x.id !== id)))
    );
  }

  scrapeUrl(url: string): Observable<Partial<Job>> {
    return this.http.post<Partial<Job>>(`${this.API}/jobs/scrape`, { url });
  }

  analyzeResume(resume_text: string, job_description: string): Observable<ResumeAnalysis> {
    return this.http.post<ResumeAnalysis>(`${this.API}/ai/analyze`, { resume_text, job_description });
  }
}
