import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">
        <i class="pi pi-exclamation-circle"></i>
        Error
      </h5>
      <button type="button" class="btn-close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <div class="error-content">
        <div class="error-icon">
          <i class="pi pi-times-circle"></i>
        </div>
        <h4>{{ title }}</h4>
        <p>{{ message }}</p>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" (click)="activeModal.close()">
        OK
      </button>
    </div>
  `,
  styles: [`
    .modal-header {
      background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
      color: white;
      border: none;
      padding: 1.5rem;
      border-radius: 16px 16px 0 0;
    }

    .modal-header .modal-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
    }

    .modal-header .modal-title i {
      font-size: 1.5rem;
    }

    .modal-header .btn-close {
      filter: brightness(0) invert(1);
      opacity: 0.8;
    }

    .modal-header .btn-close:hover {
      opacity: 1;
    }

    .modal-body {
      padding: 2rem;
    }

    .error-content {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .error-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.5rem;
    }

    .error-icon i {
      font-size: 3rem;
      color: #EF4444;
    }

    .error-content h4 {
      color: #1F2937;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
    }

    .error-content p {
      color: #6B7280;
      font-size: 1rem;
      line-height: 1.6;
      margin: 0;
      max-width: 400px;
    }

    .modal-footer {
      border-top: 1px solid #E5E7EB;
      padding: 1.25rem 1.5rem;
      display: flex;
      justify-content: center;
      gap: 1rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.3s ease;
      min-width: 120px;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }

    .btn-primary:active {
      transform: translateY(0);
    }
  `]
})
export class ErrorModalComponent {
  @Input() title: string = 'Error';
  @Input() message: string = '';

  constructor(public activeModal: NgbActiveModal) {}
}

