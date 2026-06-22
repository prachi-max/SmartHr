import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export interface Job {
  id: number;
  company: string;
  role: string;
  status: 'applied' | 'shortlisted' | 'interview' | 'offer' | 'rejected';
  applied_date: string;
  job_url?: string;
  job_description?: string;
  notes?: string;
  contact_name?: string;
  contact_email?: string;
}

@Injectable({ providedIn: 'root' })
export class JobsService {
  private readonly API = 'http://localhost:8000/api';
  jobs = signal<Job[]>([]);

  constructor(private http: HttpClient) {}

  loadJobs() {
    return this.http.get<Job[]>(`${this.API}/jobs/`).pipe(
      tap(jobs => this.jobs.set(jobs))
    );
  }

  createJob(payload: Partial<Job>) {
    return this.http.post<Job>(`${this.API}/jobs/`, payload).pipe(
      tap(() => this.loadJobs().subscribe())
    );
  }

  updateJob(id: number, payload: Partial<Job>) {
    return this.http.put<Job>(`${this.API}/jobs/${id}`, payload).pipe(
      tap(() => this.loadJobs().subscribe())
    );
  }

  deleteJob(id: number) {
    return this.http.delete(`${this.API}/jobs/${id}`).pipe(
      tap(() => this.jobs.update(jobs => jobs.filter(j => j.id !== id)))
    );
  }

  scrapeUrl(url: string) {
    return this.http.post<Partial<Job>>(`${this.API}/jobs/scrape`, { url });
  }

  getStats() {
    const jobs = this.jobs();
    return {
      total: jobs.length,
      applied: jobs.filter(j => j.status === 'applied').length,
      shortlisted: jobs.filter(j => j.status === 'shortlisted').length,
      interview: jobs.filter(j => j.status === 'interview').length,
      offer: jobs.filter(j => j.status === 'offer').length,
      rejected: jobs.filter(j => j.status === 'rejected').length,
    };
  }
}
