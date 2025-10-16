import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Contestant, Position } from '../../../models/models';

@Component({
  selector: 'app-contestants',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    CardModule, 
    ButtonModule, 
    TableModule, 
    DialogModule, 
    InputTextModule, 
    DropdownModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './contestants.component.html',
  styleUrls: ['./contestants.component.css']
})
export class ContestantsComponent implements OnInit {
  contestants: Contestant[] = [];
  positions: Position[] = [];
  loading = true;
  displayDialog = false;
  isEditMode = false;

  // Form data
  currentContestant: any = {
    name: '',
    positionId: '',
    bio: ''
  };

  positionOptions: any[] = [];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    Promise.all([
      this.apiService.getContestants().toPromise(),
      this.apiService.getPositions().toPromise()
    ]).then(([contestants, positions]) => {
      this.contestants = contestants || [];
      this.positions = positions || [];
      
      // Create position options with formatted labels
      this.positionOptions = this.positions.map(p => ({
        label: p.state ? `${p.name} (${p.state})` : p.name,
        value: p._id
      }));
      
      this.loading = false;
    }).catch(error => {
      console.error('Error loading data:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load data'
      });
      this.loading = false;
    });
  }

  getPositionName(positionId: string): string {
    const position = this.positions.find(p => p._id === positionId);
    if (!position) return 'Unknown Position';
    return position.state ? `${position.name} (${position.state})` : position.name;
  }

  getPositionCategory(positionId: string): string {
    const position = this.positions.find(p => p._id === positionId);
    return position?.category || 'Unknown';
  }

  openNewDialog() {
    this.isEditMode = false;
    this.currentContestant = {
      name: '',
      positionId: '',
      bio: ''
    };
    this.displayDialog = true;
  }

  openEditDialog(contestant: Contestant) {
    this.isEditMode = true;
    this.currentContestant = { ...contestant };
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
    this.currentContestant = {
      name: '',
      positionId: '',
      bio: ''
    };
  }

  saveContestant() {
    if (!this.currentContestant.name || !this.currentContestant.positionId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all required fields'
      });
      return;
    }

    if (this.isEditMode && this.currentContestant._id) {
      // Update existing contestant
      this.apiService.updateContestant(this.currentContestant._id, this.currentContestant).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Contestant updated successfully'
          });
          this.hideDialog();
          this.loadData();
        },
        error: (error) => {
          console.error('Error updating contestant:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update contestant'
          });
        }
      });
    } else {
      // Create new contestant
      this.apiService.createContestant(this.currentContestant).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Contestant created successfully'
          });
          this.hideDialog();
          this.loadData();
        },
        error: (error) => {
          console.error('Error creating contestant:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create contestant'
          });
        }
      });
    }
  }

  deleteContestant(contestant: Contestant) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete contestant "${contestant.name}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (contestant._id) {
          this.apiService.deleteContestant(contestant._id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Contestant deleted successfully'
              });
              this.loadData();
            },
            error: (error) => {
              console.error('Error deleting contestant:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete contestant'
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

