import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-voter-upload-modal',
  standalone: true,
  imports: [CommonModule],
  providers: [MessageService],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">
        <i class="pi pi-upload me-2"></i>
        Upload Voters
      </h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    
    <div class="modal-body">
      <div class="upload-container">
        <div class="upload-info mb-4">
          <div class="alert alert-info">
            <i class="pi pi-info-circle me-2"></i>
            <strong>Instructions:</strong>
            <ul class="mb-0 mt-2">
              <li>Upload an Excel file (.xlsx) containing voter information</li>
              <li>Required columns: email, firstName, lastName, phoneNumber</li>
              <li>Optional columns: maidenName</li>
            </ul>
          </div>
        </div>

        <div class="file-upload-area" (click)="fileInput.click()" 
             [class.has-file]="uploadedFile"
             (dragover)="onDragOver($event)"
             (dragleave)="onDragLeave($event)"
             (drop)="onDrop($event)">
          <input 
            #fileInput
            type="file" 
            accept=".xlsx,.xls"
            (change)="onFileSelect($event)"
            style="display: none"
          />
          <div class="upload-content">
            <i class="pi pi-cloud-upload upload-icon"></i>
            <p class="upload-text" *ngIf="!uploadedFile">
              <strong>Click to browse</strong> or drag and drop your Excel file here
            </p>
            <p class="upload-text" *ngIf="uploadedFile">
              <i class="pi pi-file-excel me-2"></i>
              <strong>{{ uploadedFile.name }}</strong>
              <br>
              <small>{{ formatFileSize(uploadedFile.size) }}</small>
            </p>
          </div>
        </div>

        <div class="mt-3" *ngIf="uploadedFile">
          <button type="button" class="btn btn-outline-danger btn-sm" (click)="clearFile()">
            <i class="pi pi-times me-1"></i> Clear File
          </button>
        </div>
      </div>
    </div>
    
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">
        <i class="pi pi-times me-1"></i> Cancel
      </button>
      <button 
        type="button" 
        class="btn btn-primary" 
        (click)="uploadExcel()"
        [disabled]="!uploadedFile || uploading"
      >
        <i class="pi pi-upload me-1"></i> 
        {{ uploading ? 'Uploading...' : 'Upload' }}
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

    .upload-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .file-upload-area {
      border: 3px dashed #cbd5e1;
      border-radius: 12px;
      padding: 3rem 2rem;
      text-align: center;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .file-upload-area:hover {
      border-color: #3B82F6;
      background: #f0f9ff;
    }

    .file-upload-area.has-file {
      border-color: #059669;
      background: #f0fdf4;
    }

    .upload-icon {
      font-size: 4rem;
      color: #64748b;
      margin-bottom: 1rem;
    }

    .upload-text {
      font-size: 1.1rem;
      color: #475569;
      margin: 0;
    }

    .alert {
      border-radius: 8px;
      border: none;
      padding: 1rem 1.25rem;
    }

    .alert-info {
      background: #dbeafe;
      color: #1e3a8a;
    }

    .alert ul {
      padding-left: 1.5rem;
    }

    .alert li {
      margin-bottom: 0.5rem;
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

    .btn-outline-danger {
      border: 2px solid #dc2626;
      color: #dc2626;
      background: transparent;
    }

    .btn-outline-danger:hover {
      background: #dc2626;
      color: white;
    }
  `]
})
export class VoterUploadModalComponent {
  @Output() reload = new EventEmitter<boolean>();

  uploadedFile: File | null = null;
  uploading = false;

  constructor(
    public activeModal: NgbActiveModal,
    private apiService: ApiService,
    private messageService: MessageService
  ) {}

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFile = file;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.uploadedFile = files[0];
    }
  }

  clearFile() {
    this.uploadedFile = null;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  uploadExcel() {
    if (!this.uploadedFile) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select a file to upload'
      });
      return;
    }

    this.uploading = true;

    this.apiService.uploadVoters(this.uploadedFile).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Successfully uploaded ${response.count} voters`
        });
        this.uploading = false;
        this.reload.emit(true);
        this.activeModal.close('uploaded');
      },
      error: (error: any) => {
        console.error('Error uploading voters:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to upload voters'
        });
        this.uploading = false;
      }
    });
  }
}

