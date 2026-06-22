import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-bg">
      <div class="auth-card">
        <div class="auth-logo">Smart<span>Hire</span></div>
        <p class="auth-sub">Track your job search. Land your dream role.</p>

        <div class="auth-tabs">
          <div class="tab" [class.active]="tab()==='login'"    (click)="tab.set('login')">Sign In</div>
          <div class="tab" [class.active]="tab()==='register'" (click)="tab.set('register')">Create Account</div>
        </div>

        <div class="msg error"   *ngIf="err() && !ok()">{{ err() }}</div>
        <div class="msg success" *ngIf="ok()">{{ err() }}</div>

        <!-- LOGIN -->
        <ng-container *ngIf="tab()==='login'">
          <div class="form-group">
            <label class="form-label" for="loginEmailInput">Email</label>
            <input id="loginEmailInput" name="loginEmail" class="form-input" [(ngModel)]="email" type="email" placeholder="you@example.com" (keyup.enter)="login()">
          </div>
          <div class="form-group">
            <label class="form-label" for="loginPassInput">Password</label>
            <input id="loginPassInput" name="loginPass" class="form-input" [(ngModel)]="pass"  type="password" placeholder="••••••••" (keyup.enter)="login()">
          </div>
          <button class="btn btn-primary btn-full" (click)="login()" [disabled]="busy()">
            {{ busy() ? 'Signing in…' : 'Sign In' }}
          </button>

          <!-- 🟢 Recruiter Demo Box (Styled for your layout variables) -->
          <div class="demo-creds-container" (click)="email='jonejadav02@gmail.com'; pass='jadav@02'">
            <div class="demo-title">⚡ Recruiter Demo Account</div>
           <!-- Locate lines 43-48 inside your template block and change them to this: -->
          <div class="demo-row">
         <span>Email:</span> <strong>jonejadav02&#64;gmail.com</strong>
             </div>
<div class="demo-row">
  <span>Password:</span> <strong>jadav&#64;02</strong>
</div>

            <div class="demo-hint">(Click anywhere on this box to auto-fill)</div>
          </div>
        </ng-container>

        <!-- REGISTER -->
        <ng-container *ngIf="tab()==='register'">
          <div class="form-group">
            <label class="form-label" for="registerNameInput">Full Name</label>
            <input id="registerNameInput" name="registerName" class="form-input" [(ngModel)]="name" type="text" placeholder="Your Name">
          </div>
          <div class="form-group">
            <label class="form-label" for="registerEmailInput">Email</label>
            <input id="registerEmailInput" name="registerEmail" class="form-input" [(ngModel)]="email" type="email" placeholder="you@example.com">
          </div>
          <div class="form-group">
            <label class="form-label" for="registerPassInput">Password</label>
            <input id="registerPassInput" name="registerPass" class="form-input" [(ngModel)]="pass" type="password" placeholder="Min 8 characters" (keyup.enter)="register()">
          </div>
          <button class="btn btn-primary btn-full" (click)="register()" [disabled]="busy()">
            {{ busy() ? 'Creating…' : 'Create Account' }}
          </button>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .auth-bg {
      min-height:100vh; display:flex; align-items:center; justify-content:center;
      background:var(--bg);
      background-image:
        radial-gradient(ellipse at 25% 25%, rgba(0,212,170,.07) 0%, transparent 55%),
        radial-gradient(ellipse at 75% 75%, rgba(99,102,241,.07) 0%, transparent 55%);
    }
    .auth-card {
      background:var(--surface); border:1px solid var(--border);
      border-radius:16px; padding:2.5rem; width:420px;
    }
    .auth-logo {
      font-family:'Space Grotesk',sans-serif; font-size:1.75rem; font-weight:700;
      color:var(--accent); text-align:center; margin-bottom:6px;
    }
    .auth-logo span { color:var(--text); }
    .auth-sub { text-align:center; color:var(--text2); font-size:13px; margin-bottom:1.75rem; }
    .auth-tabs {
      display:flex; background:var(--surface2); border-radius:10px;
      padding:4px; margin-bottom:1.25rem;
    }
    .tab {
      flex:1; text-align:center; padding:8px; border-radius:7px;
      font-size:13px; font-weight:500; cursor:pointer; color:var(--text2); transition:all .15s;
    }
    .tab.active { background:var(--accent); color:#0a0f1e; }
    .msg {
      padding:10px 14px; border-radius:8px; font-size:13px; margin-bottom:.9rem;
      border:1px solid;
    }
    .msg.error   { background:rgba(239,68,68,.1); border-color:rgba(239,68,68,.3); color:var(--danger); }
    .msg.success { background:rgba(16,185,129,.1); border-color:rgba(16,185,129,.3); color:var(--success); }
    
    /* 🎨 Added Demo Credentials Styles */
    .demo-creds-container {
      margin-top: 1.5rem;
      padding: 14px;
      background: rgba(0, 212, 170, 0.04);
      border: 1px dashed var(--accent);
      border-radius: 10px;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s ease-in-out;
    }
    .demo-creds-container:hover {
      background: rgba(0, 212, 170, 0.08);
      transform: translateY(-1px);
    }
    .demo-title {
      color: var(--accent);
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 6px;
      letter-spacing: 0.3px;
    }
    .demo-row {
      font-size: 13px;
      color: var(--text2);
      margin-bottom: 4px;
    }
    .demo-row span {
      display: inline-block;
      width: 75px;
    }
    .demo-row strong {
      color: var(--text);
      font-family: monospace;
    }
    .demo-hint {
      font-size: 11px;
      color: #556080;
      margin-top: 6px;
      font-style: italic;
      text-align: center;
    }
  `]
})
export class AuthComponent {
  tab  = signal<'login'|'register'>('login');
  busy = signal(false);
  err  = signal('');
  ok   = signal(false);
  name = ''; email = ''; pass = '';

  constructor(private auth: AuthService, private jobs: JobService, private router: Router) {
    if (auth.isLoggedIn()) router.navigate(['/dashboard']);
  }

  login() {
    if (!this.email || !this.pass) { this.setErr('Please fill in all fields'); return; }
    this.busy.set(true); this.err.set('');
    this.auth.login(this.email, this.pass).subscribe({
      next: () => {
        this.auth.loadMe().subscribe();
        this.jobs.load().subscribe();
        this.busy.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: e => { this.busy.set(false); this.setErr(e.error?.detail || 'Login failed'); }
    });
  }

  register() {
    if (!this.name || !this.email || !this.pass) { this.setErr('Please fill in all fields'); return; }
    if (this.pass.length < 8) { this.setErr('Password must be at least 8 characters'); return; }
    this.busy.set(true); this.err.set('');
    this.auth.register(this.name, this.email, this.pass).subscribe({
      next: () => {
        this.busy.set(false); this.ok.set(true);
        this.err.set('Account created! Please sign in.');
        this.tab.set('login'); this.pass = '';
      },
      error: e => { this.busy.set(false); this.setErr(e.error?.detail || 'Registration failed'); }
    });
  }

  setErr(msg: string) { this.ok.set(false); this.err.set(msg); }
}
