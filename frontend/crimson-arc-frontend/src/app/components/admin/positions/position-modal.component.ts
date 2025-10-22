import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { ApiService } from '../../../services/api.service';
import { Position } from '../../../models/models';

@Component({
  selector: 'app-position-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
  providers: [MessageService],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">
        <i class="pi pi-briefcase me-2"></i>
        {{ isEditMode ? 'Edit Position' : 'Create New Position' }}
      </h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    
    <div class="modal-body">
      <form>
        <!-- Position Title -->
        <div class="mb-4">
          <label for="title" class="form-label required">Position Title</label>
          <input 
            type="text" 
            class="form-control form-control-lg" 
            id="title" 
            [(ngModel)]="currentPosition.title"
            name="title"
            placeholder="e.g., President, Vice President, Secretary"
            required
            autofocus
          />
          <small class="form-text text-muted">Enter the official title of the position</small>
        </div>

        <!-- Description -->
        <div class="mb-4">
          <label for="description" class="form-label">Description</label>
          <textarea 
            class="form-control" 
            id="description" 
            rows="3"
            [(ngModel)]="currentPosition.description"
            name="description"
            placeholder="Brief description of the position's responsibilities (optional)"
          ></textarea>
        </div>

        <!-- Category and State Row -->
        <div class="row mb-4">
          <div class="col-md-6">
            <label for="category" class="form-label required">Category</label>
            <p-dropdown 
              id="category"
              [(ngModel)]="currentPosition.category"
              [options]="categories"
              optionLabel="label"
              optionValue="value"
              placeholder="Select Category"
              [style]="{'width': '100%'}"
              styleClass="custom-dropdown"
              name="category">
              <ng-template pTemplate="selectedItem" let-option>
                <div class="dropdown-item-content" *ngIf="option">
                  <i class="pi" [ngClass]="option.value === 'National' ? 'pi-flag' : 'pi-map-marker'" 
                     [style.color]="option.value === 'National' ? '#1E40AF' : '#059669'"></i>
                  <span class="dropdown-item-text">{{ option.label }}</span>
                </div>
              </ng-template>
              <ng-template pTemplate="item" let-option>
                <div class="dropdown-item-content">
                  <i class="pi" [ngClass]="option.value === 'National' ? 'pi-flag' : 'pi-map-marker'" 
                     [style.color]="option.value === 'National' ? '#1E40AF' : '#059669'"></i>
                  <span class="dropdown-item-text">{{ option.label }}</span>
                  <small class="dropdown-item-desc">
                    {{ option.value === 'National' ? 'For all members nationwide' : 'State-specific position' }}
                  </small>
                </div>
              </ng-template>
            </p-dropdown>
          </div>

          <div class="col-md-6" *ngIf="currentPosition.category === 'State'">
            <label for="state" class="form-label required">State</label>
            <p-dropdown 
              id="state"
              [(ngModel)]="currentPosition.state"
              [options]="nigerianStates"
              optionLabel="label"
              optionValue="value"
              placeholder="Select a State"
              [filter]="true"
              filterBy="label"
              [showClear]="false"
              [style]="{'width': '100%'}"
              styleClass="custom-dropdown"
              name="state">
              <ng-template pTemplate="selectedItem" let-option>
                <div class="dropdown-item-content" *ngIf="option">
                  <i class="pi pi-map-marker" style="color: #059669"></i>
                  <span class="dropdown-item-text">{{ option.label }}</span>
                </div>
              </ng-template>
              <ng-template pTemplate="item" let-option>
                <div class="dropdown-item-content">
                  <i class="pi pi-map-marker" style="color: #059669"></i>
                  <span class="dropdown-item-text">{{ option.label }}</span>
                </div>
              </ng-template>
            </p-dropdown>
          </div>

          <div class="col-md-6" *ngIf="currentPosition.category === 'National'">
            <label for="order" class="form-label">Display Order</label>
            <input 
              type="number" 
              class="form-control" 
              id="order"
              [(ngModel)]="currentPosition.order"
              name="order"
              min="1"
              placeholder="1"
            />
            <small class="form-text text-muted">Order in which positions appear</small>
          </div>
        </div>

        <!-- Display Order for State (full width when state is selected) -->
        <div class="mb-3" *ngIf="currentPosition.category === 'State'">
          <label for="orderState" class="form-label">Display Order</label>
          <input 
            type="number" 
            class="form-control" 
            id="orderState"
            [(ngModel)]="currentPosition.order"
            name="orderState"
            min="1"
            placeholder="1"
          />
          <small class="form-text text-muted">Order in which positions appear</small>
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
        (click)="savePosition()"
        [disabled]="saving"
      >
        <i class="pi pi-check me-1"></i> 
        {{ saving ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }} Position
      </button>
    </div>
  `,
  styles: [`
    /* Modal Styles */
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

    .form-control-lg {
      padding: 1rem 1.25rem;
      font-size: 1.1rem;
      font-weight: 500;
    }

    textarea.form-control {
      resize: vertical;
      min-height: 100px;
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

    .row {
      margin-left: -0.5rem;
      margin-right: -0.5rem;
    }

    .col-md-6 {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
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
      font-size: 1rem;
    }

    ::ng-deep .custom-dropdown .p-dropdown-trigger {
      width: 3rem;
    }

    .dropdown-item-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0;
    }

    .dropdown-item-text {
      font-weight: 500;
      font-size: 1rem;
      color: #1e293b;
    }

    .dropdown-item-desc {
      display: block;
      color: #64748b;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      margin-left: 2rem;
    }

    ::ng-deep .p-dropdown-panel {
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
    }

    ::ng-deep .p-dropdown-item {
      padding: 0.75rem 1rem;
    }

    ::ng-deep .p-dropdown-item:hover {
      background: #f0f9ff !important;
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
export class PositionModalComponent implements OnInit {
  @Input() position?: Position;
  @Input() positionsCount: number = 0;
  @Output() reload = new EventEmitter<boolean>();

  isEditMode = false;
  saving = false;

  currentPosition: any = {
    title: '',
    description: '',
    category: 'National',
    state: undefined,
    order: 1
  };

  categories = [
    { label: 'National', value: 'National' },
    { label: 'State', value: 'State' }
  ];

  nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa',
    'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger',
    'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
  ].map(state => ({ label: state, value: state }));

  constructor(
    public activeModal: NgbActiveModal,
    private apiService: ApiService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    if (this.position) {
      this.isEditMode = true;
      this.currentPosition = {
        ...this.position,
        title: this.position.title || this.position.name,
        description: this.position.description || ''
      };
    } else {
      this.currentPosition.order = this.positionsCount + 1;
    }
  }

  savePosition() {
    // Validation
    if (!this.currentPosition.title?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Position title is required'
      });
      return;
    }

    if (!this.currentPosition.category) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please select a category'
      });
      return;
    }

    if (this.currentPosition.category === 'State' && !this.currentPosition.state) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please select a state for State category positions'
      });
      return;
    }

    if (this.currentPosition.category === 'National') {
      this.currentPosition.state = undefined;
    }

    const payload = {
      title: this.currentPosition.title.trim(),
      description: this.currentPosition.description?.trim() || '',
      category: this.currentPosition.category,
      state: this.currentPosition.state,
      order: this.currentPosition.order || 1
    };

    this.saving = true;

    if (this.isEditMode && this.position?._id) {
      // Update existing position
      this.apiService.updatePosition(this.position._id, payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Position updated successfully'
          });
          this.saving = false;
          this.reload.emit(true);
          this.activeModal.close('saved');
        },
        error: (error) => {
          console.error('Error updating position:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to update position'
          });
          this.saving = false;
        }
      });
    } else {
      // Create new position
      this.apiService.createPosition(payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Position created successfully'
          });
          this.saving = false;
          this.reload.emit(true);
          this.activeModal.close('saved');
        },
        error: (error) => {
          console.error('Error creating position:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to create position'
          });
          this.saving = false;
        }
      });
    }
  }
}

