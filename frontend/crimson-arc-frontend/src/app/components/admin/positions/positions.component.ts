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
import { Position } from '../../../models/models';

@Component({
  selector: 'app-positions',
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
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css']
})
export class PositionsComponent implements OnInit {
  positions: Position[] = [];
  loading = true;
  displayDialog = false;
  isEditMode = false;

  // Form data
  currentPosition: any = {
    name: '',
    category: 'National',
    state: undefined
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
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadPositions();
  }

  loadPositions() {
    this.loading = true;
    this.apiService.getPositions().subscribe({
      next: (positions) => {
        this.positions = positions;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading positions:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load positions'
        });
        this.loading = false;
      }
    });
  }

  openNewDialog() {
    this.isEditMode = false;
    this.currentPosition = {
      name: '',
      category: 'National',
      state: undefined
    };
    this.displayDialog = true;
  }

  openEditDialog(position: Position) {
    this.isEditMode = true;
    this.currentPosition = { ...position };
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
    this.currentPosition = {
      name: '',
      category: 'National',
      state: undefined
    };
  }

  savePosition() {
    if (!this.currentPosition.name || !this.currentPosition.category) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all required fields'
      });
      return;
    }

    if (this.currentPosition.category === 'State' && !this.currentPosition.state) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select a state for State category positions'
      });
      return;
    }

    if (this.currentPosition.category === 'National') {
      this.currentPosition.state = undefined;
    }

    if (this.isEditMode && this.currentPosition._id) {
      // Update existing position
      this.apiService.updatePosition(this.currentPosition._id, this.currentPosition).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Position updated successfully'
          });
          this.hideDialog();
          this.loadPositions();
        },
        error: (error) => {
          console.error('Error updating position:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update position'
          });
        }
      });
    } else {
      // Create new position
      this.apiService.createPosition(this.currentPosition).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Position created successfully'
          });
          this.hideDialog();
          this.loadPositions();
        },
        error: (error) => {
          console.error('Error creating position:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create position'
          });
        }
      });
    }
  }

  deletePosition(position: Position) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the position "${position.name}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (position._id) {
          this.apiService.deletePosition(position._id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Position deleted successfully'
              });
              this.loadPositions();
            },
            error: (error) => {
              console.error('Error deleting position:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete position'
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

