import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-submission-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">
        <i class="pi pi-send"></i>
        Confirm Submission
      </h4>
      <button type="button" class="btn-close" [disabled]="submitting" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <div class="confirm-icon">
        <i class="pi pi-question-circle"></i>
      </div>
      <p class="modal-message">
        You are about to submit your votes. This action cannot be undone.
      </p>
      <p class="confirm-text"><strong>Are you sure you want to proceed?</strong></p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" [disabled]="submitting" (click)="activeModal.dismiss()">
        <i class="pi pi-times"></i> Cancel
      </button>
      <button type="button" class="btn btn-success" [disabled]="submitting" (click)="submit()">
        <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2"></span>
        <i *ngIf="!submitting" class="pi pi-check"></i>
        {{ submitting ? 'Submitting...' : 'Submit Votes' }}
      </button>
    </div>
  `,
  styles: [`
    .modal-header {
      background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
      border-bottom: 3px solid #1E40AF;
      padding: 1.5rem;
    }

    .modal-header .modal-title {
      color: #1E40AF;
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

    .confirm-icon {
      margin-bottom: 1.5rem;
    }

    .confirm-icon i {
      font-size: 4.5rem;
      color: #1E40AF;
      animation: bounce 2s infinite;
    }

    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .modal-message {
      font-size: 1.125rem;
      color: #374151;
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .confirm-text {
      font-size: 1.125rem;
      color: #1E40AF;
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

    .btn-secondary:hover:not(:disabled) {
      background: #4B5563;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
    }

    .btn-success {
      background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
      border: none;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background: linear-gradient(135deg, #059669 0%, #10B981 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
      border-width: 0.15rem;
    }
  `]
})
export class ConfirmSubmissionModalComponent {
  submitting = false;

  constructor(public activeModal: NgbActiveModal) {}

  submit() {
    this.submitting = true;
    this.activeModal.close(true);
  }
}

