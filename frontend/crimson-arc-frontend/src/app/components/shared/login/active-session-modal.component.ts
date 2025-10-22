import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-active-session-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">
        <i class="pi pi-lock"></i>
        Account Already Logged In
      </h5>
      <button type="button" class="btn-close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <div class="session-content">
        <div class="warning-icon">
          <i class="pi pi-exclamation-triangle"></i>
        </div>
        <h4>Active Session Detected</h4>
        <p class="main-message">{{ message }}</p>
        
        <div class="session-details" *ngIf="sessionInfo">
          <h5>Current Active Session:</h5>
          <div class="detail-item">
            <i class="pi pi-desktop"></i>
            <div>
              <strong>Device:</strong>
              <span>{{ getDeviceName(sessionInfo.deviceInfo) }}</span>
            </div>
          </div>
          <div class="detail-item">
            <i class="pi pi-map-marker"></i>
            <div>
              <strong>IP Address:</strong>
              <span>{{ sessionInfo.ipAddress || 'Unknown' }}</span>
            </div>
          </div>
          <div class="detail-item">
            <i class="pi pi-clock"></i>
            <div>
              <strong>Login Time:</strong>
              <span>{{ formatDate(sessionInfo.loginTime) }}</span>
            </div>
          </div>
        </div>

        <div class="info-box">
          <i class="pi pi-info-circle"></i>
          <p>To login from this device, please logout from the other device first or wait for the session to expire (24 hours).</p>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" (click)="activeModal.close()">
        OK, I Understand
      </button>
    </div>
  `,
  styles: [`
    .modal-header {
      background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
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

    .session-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    .warning-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .warning-icon i {
      font-size: 3rem;
      color: #F59E0B;
    }

    .session-content h4 {
      color: #1F2937;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
      text-align: center;
    }

    .main-message {
      color: #6B7280;
      font-size: 1rem;
      line-height: 1.6;
      margin: 0;
      text-align: center;
      max-width: 500px;
    }

    .session-details {
      width: 100%;
      background: #F9FAFB;
      border-radius: 12px;
      padding: 1.5rem;
      border-left: 4px solid #F59E0B;
    }

    .session-details h5 {
      color: #1F2937;
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 1rem 0;
    }

    .detail-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #E5E7EB;
    }

    .detail-item:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    .detail-item i {
      color: #F59E0B;
      font-size: 1.25rem;
      margin-top: 0.2rem;
    }

    .detail-item > div {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .detail-item strong {
      color: #4B5563;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .detail-item span {
      color: #1F2937;
      font-size: 0.95rem;
    }

    .info-box {
      width: 100%;
      background: #FFF9E6;
      border-radius: 8px;
      padding: 1rem;
      display: flex;
      gap: 0.75rem;
      border-left: 4px solid #F59E0B;
    }

    .info-box i {
      color: #F59E0B;
      font-size: 1.25rem;
      flex-shrink: 0;
      margin-top: 0.1rem;
    }

    .info-box p {
      margin: 0;
      color: #92400E;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .modal-footer {
      border-top: 1px solid #E5E7EB;
      padding: 1.25rem 1.5rem;
      display: flex;
      justify-content: center;
    }

    .btn-primary {
      background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
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
      background: linear-gradient(135deg, #D97706 0%, #B45309 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    }

    .btn-primary:active {
      transform: translateY(0);
    }
  `]
})
export class ActiveSessionModalComponent {
  @Input() message: string = '';
  @Input() sessionInfo: any = null;

  constructor(public activeModal: NgbActiveModal) {}

  getDeviceName(deviceInfo: string): string {
    if (!deviceInfo) return 'Unknown Device';
    
    // Extract browser and OS info from User-Agent
    if (deviceInfo.includes('Chrome')) return 'Chrome Browser';
    if (deviceInfo.includes('Firefox')) return 'Firefox Browser';
    if (deviceInfo.includes('Safari')) return 'Safari Browser';
    if (deviceInfo.includes('Edge')) return 'Edge Browser';
    
    return deviceInfo.substring(0, 50) + '...';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleString();
    }
  }
}

