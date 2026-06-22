import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'kanban',
    loadComponent: () => import('./components/kanban/kanban.component').then(m => m.KanbanComponent),
    canActivate: [authGuard]
  },
  {
    path: 'applications',
    loadComponent: () => import('./components/applications/applications.component').then(m => m.ApplicationsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'resume-analyzer',
    loadComponent: () => import('./components/resume-analyzer/resume-analyzer.component').then(m => m.ResumeAnalyzerComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'auth' }
];
