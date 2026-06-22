import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavComponent } from '../nav/nav.component';
import { ModalComponent } from '../modal/modal.component';
import { ToastComponent } from '../toast/toast.component';
import { AuthService } from '../../services/auth.service';
import { JobsService } from '../../services/jobs.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavComponent, ModalComponent, ToastComponent],
  template: `
    <app-nav></app-nav>
    <div class="layout">
      <router-outlet></router-outlet>
    </div>
    <app-modal></app-modal>
    <app-toast></app-toast>
  `,
  styles: [`
    .layout { display: flex; min-height: calc(100vh - 56px); }
    :host ::ng-deep .main { flex: 1; padding: 1.5rem; overflow-y: auto; }
    :host ::ng-deep app-nav { display: contents; }
  `]
})
export class LayoutComponent implements OnInit {
  constructor(private auth: AuthService, private jobs: JobsService) {}

  ngOnInit() {
    this.auth.loadMe().subscribe();
    this.jobs.loadJobs().subscribe();
  }
}
