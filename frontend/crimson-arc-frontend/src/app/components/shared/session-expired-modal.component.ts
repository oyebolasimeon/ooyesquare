import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-session-expired-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">
        <i class="pi pi-sign-out"></i>
        Session Expired
      </h5>
    </div>
    <div class="modal-body">
      <div class="expired-content">
        <div class="expired-icon">
          <i class="pi pi-exclamation-circle"></i>
        </div>
        <h4>Your Session Has Expired</h4>
        <p>Your account was accessed from another device. For security reasons, you have been logged out from this device.</p>
        
        <div class="info-box">
          <i class="pi pi-info-circle"></i>
          <p>Please login again to continue voting.</p>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" (click)="activeModal.close()">
        OK, Login Again
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
      width: 100%;
      justify-content: center;
    }

    .modal-header .modal-title i {
      font-size: 1.5rem;
    }

    .modal-body {
      padding: 2rem;
    }

    .expired-content {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    .expired-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .expired-icon i {
      font-size: 3rem;
      color: #EF4444;
    }

    .expired-content h4 {
      color: #1F2937;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
    }

    .expired-content p {
      color: #6B7280;
      font-size: 1rem;
      line-height: 1.6;
      margin: 0;
      max-width: 400px;
    }

    .info-box {
      width: 100%;
      max-width: 400px;
      background: #FEF2F2;
      border-radius: 8px;
      padding: 1rem;
      display: flex;
      gap: 0.75rem;
      align-items: center;
      justify-content: center;
      border-left: 4px solid #EF4444;
    }

    .info-box i {
      color: #EF4444;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .info-box p {
      margin: 0;
      color: #991B1B;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .modal-footer {
      border-top: 1px solid #E5E7EB;
      padding: 1.25rem 1.5rem;
      display: flex;
      justify-content: center;
    }

    .btn-primary {
      background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.3s ease;
      color: white;
      min-width: 180px;
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
export class SessionExpiredModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}

