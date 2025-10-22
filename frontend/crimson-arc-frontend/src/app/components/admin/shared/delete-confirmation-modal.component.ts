import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">
        <i class="pi pi-exclamation-triangle"></i>
        Confirm Deletion
      </h4>
      <button type="button" class="btn-close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <div class="warning-icon">
        <i class="pi pi-trash"></i>
      </div>
      <p class="modal-message">{{ message }}</p>
      <p class="warning-text"><strong>This action cannot be undone.</strong></p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">
        <i class="pi pi-times"></i> Cancel
      </button>
      <button type="button" class="btn btn-danger" (click)="activeModal.close(true)">
        <i class="pi pi-trash"></i> Delete
      </button>
    </div>
  `,
  styles: [`
    .modal-header {
      background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
      border-bottom: 3px solid #DC2626;
      padding: 1.5rem;
    }

    .modal-header .modal-title {
      color: #991B1B;
      font-weight: 700;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .modal-header .modal-title i {
      font-size: 1.75rem;
    }

    .modal-body {
      padding: 2.5rem 2rem;
      text-align: center;
    }

    .warning-icon {
      margin-bottom: 1.5rem;
    }

    .warning-icon i {
      font-size: 4.5rem;
      color: #DC2626;
      animation: shake 1s infinite;
    }

    @keyframes shake {
      0%, 100% {
        transform: rotate(0deg);
      }
      25% {
        transform: rotate(-5deg);
      }
      75% {
        transform: rotate(5deg);
      }
    }

    .modal-message {
      font-size: 1.125rem;
      color: #374151;
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .warning-text {
      color: #DC2626;
      font-size: 1rem;
      margin: 0;
    }

    .modal-footer {
      padding: 1.5rem;
      border-top: 1px solid #E5E7EB;
      background: #F9FAFB;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      border-radius: 8px;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-secondary {
      background: #6B7280;
      border: none;
      color: white;
    }

    .btn-secondary:hover {
      background: #4B5563;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
    }

    .btn-danger {
      background: linear-gradient(135deg, #DC2626 0%, #EF4444 100%);
      border: none;
      color: white;
    }

    .btn-danger:hover {
      background: linear-gradient(135deg, #B91C1C 0%, #DC2626 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    }
  `]
})
export class DeleteConfirmationModalComponent {
  @Input() message: string = 'Are you sure you want to delete this item?';

  constructor(public activeModal: NgbActiveModal) {}
}

