import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmationModalComponent } from '../shared/delete-confirmation-modal.component';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Voter } from '../../../models/models';
import { AdminSidebarComponent } from '../shared/admin-sidebar.component';
import { AdminTopbarComponent } from '../shared/admin-topbar.component';
import { VoterUploadModalComponent } from './voter-upload-modal.component';

@Component({
  selector: 'app-voters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule, 
    ButtonModule, 
    TableModule, 
    TagModule,
    TooltipModule,
    ToastModule,
    InputTextModule,
    AdminSidebarComponent,
    AdminTopbarComponent
  ],
  providers: [MessageService],
  templateUrl: './voters.component.html',
  styleUrls: ['./voters.component.css']
})
export class VotersComponent implements OnInit {
  voters: Voter[] = [];
  filteredVoters: Voter[] = [];
  loading = true;
  resendingEmails: { [key: string]: boolean } = {};
  resendingAll = false;
  searchText: string = '';
  rowsPerPage: number = 10;
  rowsPerPageOptions: number[] = [10, 25, 50, 100];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loadVoters();
  }

  loadVoters() {
    this.loading = true;
    this.apiService.getVoters().subscribe({
      next: (voters) => {
        this.voters = voters;
        this.filteredVoters = voters;
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

  filterVoters() {
    if (!this.searchText.trim()) {
      this.filteredVoters = this.voters;
      return;
    }

    const searchLower = this.searchText.toLowerCase().trim();
    this.filteredVoters = this.voters.filter(voter => {
      return (
        voter.email?.toLowerCase().includes(searchLower) ||
        voter.phoneNumber?.toLowerCase().includes(searchLower) ||
        voter.firstName?.toLowerCase().includes(searchLower) ||
        voter.lastName?.toLowerCase().includes(searchLower) ||
        voter.maidenName?.toLowerCase().includes(searchLower) ||
        voter.status?.toLowerCase().includes(searchLower) ||
        (voter.hasVoted ? 'yes' : 'no').includes(searchLower)
      );
    });
  }

  clearSearch() {
    this.searchText = '';
    this.filteredVoters = this.voters;
  }

  openUploadDialog() {
    const modalRef = this.modalService.open(VoterUploadModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.reload.subscribe((val: boolean) => {
      if (val) {
        this.loadVoters();
        modalRef.dismiss();
      }
    });
  }

  toggleVoterStatus(voter: Voter) {
    const newStatus = voter.isActive ? 'inactive' : 'active';
    const action = voter.isActive ? 'deactivate' : 'activate';
    const modalRef = this.modalService.open(DeleteConfirmationModalComponent, {
      centered: true
    });
    modalRef.componentInstance.message = `Are you sure you want to ${action} voter "${voter.email}"?`;
    
    modalRef.result.then(
      (confirmed) => {
        if (confirmed && voter._id) {
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
      },
      () => {} // Dismissed
    );
  }

  deleteVoter(voter: Voter) {
    const modalRef = this.modalService.open(DeleteConfirmationModalComponent, {
      centered: true
    });
    modalRef.componentInstance.message = `Are you sure you want to delete voter "${voter.email}"?`;
    
    modalRef.result.then(
      (confirmed) => {
        if (confirmed && voter._id) {
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
      },
      () => {} // Dismissed
    );
  }

  resendEmail(voter: Voter) {
    if (!voter._id) return;
    
    this.resendingEmails[voter._id] = true;
    
    this.apiService.resendVoterEmail(voter._id).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Credentials email resent to ${voter.email}`
        });
        this.resendingEmails[voter._id] = false;
      },
      error: (error) => {
        console.error('Error resending email:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to resend email'
        });
        this.resendingEmails[voter._id] = false;
      }
    });
  }

  resendAllEmails() {
    if (this.voters.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'No voters to send emails to'
      });
      return;
    }

    this.resendingAll = true;
    
    this.apiService.resendAllVotersEmails().subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Emails sent: ${response.results.sent} successful, ${response.results.failed} failed`
        });
        this.resendingAll = false;
      },
      error: (error) => {
        console.error('Error resending all emails:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to resend emails'
        });
        this.resendingAll = false;
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

