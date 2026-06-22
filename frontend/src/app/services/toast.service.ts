import { Injectable, signal } from '@angular/core';

export interface Toast { id: number; msg: string; type: 'success' | 'error' | 'info'; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private _id = 0;

  success(msg: string) { this._push(msg, 'success'); }
  error(msg: string)   { this._push(msg, 'error'); }
  info(msg: string)    { this._push(msg, 'info'); }

  private _push(msg: string, type: Toast['type']) {
    const id = this._id++;
    this.toasts.update(t => [...t, { id, msg, type }]);
    setTimeout(() => this.toasts.update(t => t.filter(x => x.id !== id)), 3500);
  }
}
