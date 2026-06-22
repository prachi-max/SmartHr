import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tc">
      <div *ngFor="let t of svc.toasts()" class="toast {{t.type}}"
           (click)="removeToast(t.id)">
        <span class="dot"></span>{{ t.msg }}
      </div>
    </div>
  `,
  
  styles: [`
    .tc { position:fixed; bottom:24px; right:24px; z-index:9999; display:flex; flex-direction:column; gap:8px; }
    .toast {
      background:var(--surface); border:1px solid var(--border); border-radius:10px;
      padding:12px 16px; font-size:13px; display:flex; align-items:center; gap:10px;
      min-width:220px; cursor:pointer; animation:su .2s ease;
    }
    .toast.success { border-color:var(--success); }
    .toast.error   { border-color:var(--danger);  }
    .toast.info    { border-color:var(--accent2); }
    .dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
    .toast.success .dot { background:var(--success); }
    .toast.error   .dot { background:var(--danger);  }
    .toast.info    .dot { background:var(--accent2); }
    @keyframes su { from{transform:translateY(12px);opacity:0} to{transform:translateY(0);opacity:1} }
  `]
})
export class ToastComponent { 
  constructor(public svc: ToastService) {} 

  removeToast(id: any) {
    this.svc.toasts.update(currentToasts => currentToasts.filter(x => x.id !== id));
  }
}
