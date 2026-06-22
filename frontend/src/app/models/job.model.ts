export type JobStatus = 'applied' | 'shortlisted' | 'interview' | 'offer' | 'rejected';

export const ALL_STATUSES: JobStatus[] = ['applied', 'shortlisted', 'interview', 'offer', 'rejected'];

export const STATUS_COLOR: Record<JobStatus, string> = {
  applied:     '#6366f1',
  shortlisted: '#f59e0b',
  interview:   '#00d4aa',
  offer:       '#10b981',
  rejected:    '#ef4444',
};

export interface Job {
  id?:              number;
  company:          string;
  role:             string;
  status:           JobStatus;
  applied_date?:    string;
  deadline?:        string | null;
  job_url?:         string | null;
  job_description?: string | null;
  notes?:           string | null;
  contact_name?:    string | null;
  contact_email?:   string | null;
}

export interface User {
  id:         number;
  name:       string;
  email:      string;
  created_at: string;
}

export interface ResumeAnalysis {
  match_score:      number;
  summary:          string;
  missing_keywords: string[];
  strong_points:    string[];
  suggestions:      string[];
}
