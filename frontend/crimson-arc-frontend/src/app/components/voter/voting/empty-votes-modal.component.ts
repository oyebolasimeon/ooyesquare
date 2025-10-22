import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Position } from '../../../models/models';

@Component({
  selector: 'app-empty-votes-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">
        <i class="pi pi-exclamation-triangle"></i>
        Incomplete Voting
      </h4>
      <button type="button" class="btn-close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <div class="warning-icon">
        <i class="pi pi-exclamation-triangle"></i>
      </div>
      <p class="modal-message">
        You have not voted for {{ emptyPositions.length }} position(s):
      </p>
      <ul class="empty-positions-list">
        <li *ngFor="let pos of emptyPositions">{{ pos.name || pos.title }}</li>
      </ul>
      <p class="warning-text">Are you sure you want to continue without voting for these positions?</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">
        <i class="pi pi-arrow-left"></i> Go Back
      </button>
      <button type="button" class="btn btn-warning" (click)="activeModal.close(true)">
        <i class="pi pi-arrow-right"></i> Continue
      </button>
    </div>
  `,
  styles: [`
    .modal-header {
      background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
      border-bottom: 3px solid #F59E0B;
      padding: 1.5rem;
    }

    .modal-header .modal-title {
      color: #92400E;
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
      padding: 2rem;
      text-align: center;
    }

    .warning-icon {
      margin-bottom: 1.5rem;
    }

    .warning-icon i {
      font-size: 4rem;
      color: #F59E0B;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
    }

    .modal-message {
      font-size: 1.125rem;
      color: #374151;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }

    .empty-positions-list {
      text-align: left;
      max-height: 200px;
      overflow-y: auto;
      padding: 1.25rem;
      background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
      border-radius: 12px;
      margin: 1.5rem 0;
      border-left: 4px solid #F59E0B;
    }

    .empty-positions-list li {
      padding: 0.75rem 0;
      color: #92400E;
      font-weight: 500;
      border-bottom: 1px solid #FCD34D;
    }

    .empty-positions-list li:last-child {
      border-bottom: none;
    }

    .warning-text {
      color: #374151;
      font-size: 1rem;
      line-height: 1.6;
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

    .btn-warning {
      background: linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%);
      border: none;
      color: #92400E;
    }

    .btn-warning:hover {
      background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
      color: white;
    }
  `]
})
export class EmptyVotesModalComponent {
  @Input() emptyPositions: Position[] = [];

  constructor(public activeModal: NgbActiveModal) {}
}

