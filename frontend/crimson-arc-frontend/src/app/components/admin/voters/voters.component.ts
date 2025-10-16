import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Voter } from '../../../models/models';

@Component({
  selector: 'app-voters',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    CardModule, 
    ButtonModule, 
    TableModule, 
    DialogModule, 
    InputTextModule,
    FileUploadModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './voters.component.html',
  styleUrls: ['./voters.component.css']
})
export class VotersComponent implements OnInit {
  voters: Voter[] = [];
  loading = true;
  displayUploadDialog = false;
  uploadedFile: File | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadVoters();
  }

  loadVoters() {
    this.loading = true;
    this.apiService.getVoters().subscribe({
      next: (voters) => {
        this.voters = voters;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading voters:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load voters'
        });
        this.loading = false;
      }
    });
  }

  openUploadDialog() {
    this.displayUploadDialog = true;
  }

  hideUploadDialog() {
    this.displayUploadDialog = false;
    this.uploadedFile = null;
  }

  onFileSelect(event: any) {
    if (event.files && event.files.length > 0) {
      this.uploadedFile = event.files[0];
    }
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

    this.apiService.uploadVoters(this.uploadedFile).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Successfully uploaded ${response.count} voters`
        });
        this.hideUploadDialog();
        this.loadVoters();
      },
      error: (error: any) => {
        console.error('Error uploading voters:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to upload voters'
        });
      }
    });
  }

  toggleVoterStatus(voter: Voter) {
    const newStatus = voter.isActive ? 'inactive' : 'active';
    const action = voter.isActive ? 'deactivate' : 'activate';

    this.confirmationService.confirm({
      message: `Are you sure you want to ${action} voter "${voter.email}"?`,
      header: 'Confirm Status Change',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (voter._id) {
          this.apiService.updateVoter(voter._id, { isActive: !voter.isActive }).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: `Voter ${action}d successfully`
              });
              this.loadVoters();
            },
            error: (error) => {
              console.error('Error updating voter:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update voter status'
              });
            }
          });
        }
      }
    });
  }

  deleteVoter(voter: Voter) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete voter "${voter.email}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (voter._id) {
          this.apiService.deleteVoter(voter._id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Voter deleted successfully'
              });
              this.loadVoters();
            },
            error: (error: any) => {
              console.error('Error deleting voter:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete voter'
              });
            }
          });
        }
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }
}

