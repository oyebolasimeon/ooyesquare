import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { ApiService } from '../../../services/api.service';
import { Contestant, Position } from '../../../models/models';

@Component({
  selector: 'app-contestant-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
  providers: [MessageService],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">
        <i class="pi pi-users me-2"></i>
        {{ isEditMode ? 'Edit Contestant' : 'Add New Contestant' }}
      </h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    
    <div class="modal-body">
      <form>
        <!-- First Name -->
        <div class="mb-4">
          <label for="firstName" class="form-label required">First Name</label>
          <input 
            type="text" 
            class="form-control" 
            id="firstName" 
            [(ngModel)]="currentContestant.firstName"
            name="firstName"
            placeholder="e.g., John"
            required
            autofocus
          />
          <small class="form-text text-muted">Enter the first name</small>
        </div>

        <!-- Last Name -->
        <div class="mb-4">
          <label for="lastName" class="form-label required">Last Name</label>
          <input 
            type="text" 
            class="form-control" 
            id="lastName" 
            [(ngModel)]="currentContestant.lastName"
            name="lastName"
            placeholder="e.g., Doe"
            required
          />
          <small class="form-text text-muted">Enter the last name</small>
        </div>

        <!-- Maiden Name (Optional) -->
        <div class="mb-4">
          <label for="maidenName" class="form-label">Maiden Name</label>
          <input 
            type="text" 
            class="form-control" 
            id="maidenName" 
            [(ngModel)]="currentContestant.maidenName"
            name="maidenName"
            placeholder="e.g., Smith (optional)"
          />
          <small class="form-text text-muted">Enter maiden name if applicable (optional)</small>
        </div>

        <!-- Position -->
        <div class="mb-4">
          <label for="positionId" class="form-label required">Position</label>
          <p-dropdown 
            id="positionId"
            [(ngModel)]="currentContestant.positionId"
            [options]="positionOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select a position"
            [filter]="true"
            filterBy="label"
            [showClear]="false"
            [style]="{'width': '100%'}"
            styleClass="custom-dropdown"
            name="positionId">
            <ng-template pTemplate="selectedItem" let-option>
              <div class="dropdown-item-content" *ngIf="option">
                <i class="pi" 
                   [ngClass]="option.category === 'National' ? 'pi-flag' : 'pi-map-marker'" 
                   [style.color]="option.category === 'National' ? '#1E40AF' : '#059669'"></i>
                <div class="dropdown-item-info">
                  <span class="dropdown-item-text">{{ option.label }}</span>
                  <small class="dropdown-item-badge" 
                         [style.background]="option.category === 'National' ? '#dbeafe' : '#d1fae5'"
                         [style.color]="option.category === 'National' ? '#1e40af' : '#065f46'">
                    {{ option.category }}
                  </small>
                </div>
              </div>
            </ng-template>
            <ng-template pTemplate="item" let-option>
              <div class="dropdown-item-content">
                <i class="pi" 
                   [ngClass]="option.category === 'National' ? 'pi-flag' : 'pi-map-marker'" 
                   [style.color]="option.category === 'National' ? '#1E40AF' : '#059669'"></i>
                <div class="dropdown-item-info">
                  <span class="dropdown-item-text">{{ option.label }}</span>
                  <small class="dropdown-item-badge" 
                         [style.background]="option.category === 'National' ? '#dbeafe' : '#d1fae5'"
                         [style.color]="option.category === 'National' ? '#1e40af' : '#065f46'">
                    {{ option.category }}
                  </small>
                </div>
              </div>
            </ng-template>
          </p-dropdown>
          <small class="form-text text-muted">Select the position the contestant is running for</small>
        </div>

        <!-- Bio -->
        <div class="mb-4">
          <label for="bio" class="form-label">Biography</label>
          <textarea 
            class="form-control" 
            id="bio" 
            rows="4"
            [(ngModel)]="currentContestant.bio"
            name="bio"
            placeholder="Brief biography of the contestant (optional)"
          ></textarea>
          <small class="form-text text-muted">Provide a brief background about the contestant</small>
        </div>

        <!-- Photo URL (optional) -->
        <div class="mb-3">
          <label for="photo" class="form-label">Photo URL</label>
          <input 
            type="text" 
            class="form-control" 
            id="photo"
            [(ngModel)]="currentContestant.photo"
            name="photo"
            placeholder="https://example.com/photo.jpg (optional)"
          />
          <small class="form-text text-muted">Optional: URL to contestant's photo</small>
        </div>
      </form>
    </div>
    
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">
        <i class="pi pi-times me-1"></i> Cancel
      </button>
      <button 
        type="button" 
        class="btn btn-primary" 
        (click)="saveContestant()"
        [disabled]="saving"
      >
        <i class="pi pi-check me-1"></i> 
        {{ saving ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }} Contestant
      </button>
    </div>
  `,
  styles: [`
    .modal-header {
      background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
      color: white;
      border-bottom: none;
      padding: 1.5rem 2rem;
    }

    .modal-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
      display: flex;
      align-items: center;
    }

    .btn-close {
      filter: brightness(0) invert(1);
      opacity: 0.8;
    }

    .btn-close:hover {
      opacity: 1;
    }

    .modal-body {
      padding: 2rem;
      background: #f8fafc;
    }

    .modal-footer {
      padding: 1.5rem 2rem;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }

    .form-label {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }

    .form-label.required::after {
      content: ' *';
      color: #dc2626;
    }

    .form-control,
    .form-select {
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .form-control:focus,
    .form-select:focus {
      border-color: #3B82F6;
      box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.15);
      outline: none;
    }

    .form-control-lg,
    .form-select-lg {
      padding: 1rem 1.25rem;
      font-size: 1.1rem;
      font-weight: 500;
    }

    textarea.form-control {
      resize: vertical;
      min-height: 120px;
    }

    .form-text {
      color: #64748b;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .btn {
      padding: 0.65rem 1.5rem;
      font-weight: 600;
      font-size: 1rem;
      border-radius: 8px;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
    }

    .btn-primary {
      background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
      border: none;
      color: white;
      box-shadow: 0 4px 6px rgba(30, 64, 175, 0.3);
    }

    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(30, 64, 175, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #64748b;
      border: none;
      color: white;
    }

    .btn-secondary:hover {
      background: #475569;
      transform: translateY(-2px);
    }

    /* PrimeNG Dropdown Custom Styles */
    ::ng-deep .custom-dropdown {
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    ::ng-deep .custom-dropdown:not(.p-disabled):hover {
      border-color: #cbd5e1;
    }

    ::ng-deep .custom-dropdown:not(.p-disabled).p-focus {
      border-color: #3B82F6;
      box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.15);
    }

    ::ng-deep .custom-dropdown .p-dropdown-label {
      padding: 0.75rem 1rem;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      min-height: 48px;
    }

    ::ng-deep .custom-dropdown .p-dropdown-label .dropdown-item-content {
      padding: 0;
    }

    ::ng-deep .custom-dropdown .p-dropdown-trigger {
      width: 3rem;
    }

    ::ng-deep .custom-dropdown .p-dropdown-filter-container {
      background: #ffffff !important;
      padding: 0.75rem 1rem;
      border-bottom: 2px solid #e2e8f0;
    }

    ::ng-deep .custom-dropdown .p-dropdown-filter {
      background: #ffffff !important;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      padding: 0.65rem 1rem;
    }

    ::ng-deep .custom-dropdown .p-dropdown-filter:focus {
      outline: none;
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .dropdown-item-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
    }

    .dropdown-item-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
      flex-wrap: wrap;
    }

    .dropdown-item-text {
      font-weight: 500;
      font-size: 0.95rem;
      color: #1e293b;
      line-height: 1.4;
      flex: 0 1 auto;
    }

    .dropdown-item-badge {
      padding: 0.25rem 0.65rem;
      border-radius: 6px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      white-space: nowrap;
    }

    ::ng-deep .p-dropdown-panel {
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1);
      border: 2px solid #e2e8f0;
      background: #ffffff !important;
      min-width: 300px;
    }

    ::ng-deep .p-dropdown-items-wrapper {
      background: #ffffff !important;
    }

    ::ng-deep .p-dropdown-items {
      background: #ffffff !important;
      padding: 0.5rem;
    }

    ::ng-deep .p-dropdown-item {
      padding: 0.75rem 1rem;
      background: #ffffff !important;
      border-radius: 8px;
      margin: 0.15rem 0;
    }

    ::ng-deep .p-dropdown-item:hover {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%) !important;
    }

    ::ng-deep .p-dropdown-item:focus {
      box-shadow: none !important;
      background: #dbeafe !important;
    }

    .dropdown-item-content i {
      font-size: 1.2rem;
      min-width: 1.5rem;
    }
  `]
})
export class ContestantModalComponent implements OnInit {
  @Input() contestant?: Contestant;
  @Input() positions: Position[] = [];
  @Output() reload = new EventEmitter<boolean>();

  isEditMode = false;
  saving = false;

  currentContestant: any = {
    firstName: '',
    lastName: '',
    maidenName: '',
    positionId: '',
    bio: '',
    photo: '',
    order: 0
  };

  positionOptions: any[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private apiService: ApiService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // Create position options with formatted labels
    this.positionOptions = this.positions.map(p => ({
      label: p.state ? `${p.name || p.title} (${p.state})` : (p.name || p.title),
      value: p._id,
      category: p.category
    }));

    if (this.contestant) {
      this.isEditMode = true;
      this.currentContestant = {
        ...this.contestant,
        positionId: typeof this.contestant.position === 'string' 
          ? this.contestant.position 
          : this.contestant.positionId
      };
    }
  }

  saveContestant() {
    // Validation
    if (!this.currentContestant.firstName?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'First name is required'
      });
      return;
    }

    if (!this.currentContestant.lastName?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Last name is required'
      });
      return;
    }

    if (!this.currentContestant.positionId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please select a position'
      });
      return;
    }

    const payload = {
      firstName: this.currentContestant.firstName.trim(),
      lastName: this.currentContestant.lastName.trim(),
      maidenName: this.currentContestant.maidenName?.trim() || '',
      position: this.currentContestant.positionId,
      bio: this.currentContestant.bio?.trim() || '',
      photo: this.currentContestant.photo?.trim() || '',
      order: this.currentContestant.order || 0
    };

    this.saving = true;

    if (this.isEditMode && this.contestant?._id) {
      // Update existing contestant
      this.apiService.updateContestant(this.contestant._id, payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Contestant updated successfully'
          });
          this.saving = false;
          this.reload.emit(true);
          this.activeModal.close('saved');
        },
        error: (error) => {
          console.error('Error updating contestant:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to update contestant'
          });
          this.saving = false;
        }
      });
    } else {
      // Create new contestant
      this.apiService.createContestant(payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Contestant created successfully'
          });
          this.saving = false;
          this.reload.emit(true);
          this.activeModal.close('saved');
        },
        error: (error) => {
          console.error('Error creating contestant:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to create contestant'
          });
          this.saving = false;
        }
      });
    }
  }
}

