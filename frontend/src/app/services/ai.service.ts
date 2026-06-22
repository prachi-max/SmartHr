import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface AiResult {
  match_score: number;
  summary: string;
  missing_keywords: string[];
  strong_points: string[];
  suggestions: string[];
}

@Injectable({ providedIn: 'root' })
export class AiService {
 readonly API = 'https://smarthr-9d4i.onrender.com/api';


  constructor(private http: HttpClient) {}

 analyze(file: File, job_description: string, token: string) {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('job_description', job_description);

  return this.http.post<AiResult>(
    `${this.API}/ai/analyze`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}
}
