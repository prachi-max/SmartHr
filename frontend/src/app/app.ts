import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { JobService } from './services/job.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AddJobModalComponent } from './components/add-job-modal/add-job-modal.component';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent, SidebarComponent, AddJobModalComponent, ToastComponent],
  template: `
    <!-- Authenticated layout -->
    <ng-container *ngIf="auth.isLoggedIn(); else authOnly">
      <div class="app-shell">
        <div class="navbar-row"><app-navbar /></div>
        <div class="sidebar-col"><app-sidebar /></div>
        <main class="main-col"><router-outlet /></main>
      </div>
    </ng-container>

    <!-- Auth page — no shell -->
    <ng-template #authOnly>
      <router-outlet />
    </ng-template>

    <!-- Always present -->
    <app-add-job-modal />
    <app-toast />
  `
})
export class AppComponent implements OnInit {
  constructor(public auth: AuthService, private jobs: JobService, private router: Router) {}

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.jobs.load().subscribe();
      this.router.navigate(['/dashboard']);
    }
  }
}
