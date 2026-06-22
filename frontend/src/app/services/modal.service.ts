import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {
  isOpen = signal(false);
  editingJobId = signal<number | null>(null);

  open(id: number | null = null) {
    this.editingJobId.set(id);
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.editingJobId.set(null);
  }
}
