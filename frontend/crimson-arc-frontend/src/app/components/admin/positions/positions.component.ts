import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Position } from '../../../models/models';
import { AdminSidebarComponent } from '../shared/admin-sidebar.component';
import { AdminTopbarComponent } from '../shared/admin-topbar.component';
import { PositionModalComponent } from './position-modal.component';
import { DeleteConfirmationModalComponent } from '../shared/delete-confirmation-modal.component';

@Component({
  selector: 'app-positions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule, 
    ButtonModule, 
    TableModule, 
    ToastModule,
    TagModule,
    TooltipModule,
    InputTextModule,
    AdminSidebarComponent,
    AdminTopbarComponent
  ],
  providers: [MessageService],
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css']
})
export class PositionsComponent implements OnInit {
  positions: Position[] = [];
  filteredPositions: Position[] = [];
  loading = true;
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
    this.loadPositions();
  }

  loadPositions() {
    this.loading = true;
    this.apiService.getPositions().subscribe({
      next: (positions) => {
        this.positions = positions;
        this.filteredPositions = positions;
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

  filterPositions() {
    if (!this.searchText.trim()) {
      this.filteredPositions = this.positions;
      return;
    }

    const searchLower = this.searchText.toLowerCase().trim();
    this.filteredPositions = this.positions.filter(position => {
      return (
        position.title?.toLowerCase().includes(searchLower) ||
        position.name?.toLowerCase().includes(searchLower) ||
        position.category?.toLowerCase().includes(searchLower) ||
        position.state?.toLowerCase().includes(searchLower) ||
        position.description?.toLowerCase().includes(searchLower)
      );
    });
  }

  clearSearch() {
    this.searchText = '';
    this.filteredPositions = this.positions;
  }

  openNewDialog() {
    const modalRef = this.modalService.open(PositionModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.positionsCount = this.positions.length;
    
    modalRef.componentInstance.reload.subscribe((val: boolean) => {
      if (val) {
        this.loadPositions();
        modalRef.dismiss();
      }
    });
  }

  openEditDialog(position: Position) {
    const modalRef = this.modalService.open(PositionModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.position = position;
    modalRef.componentInstance.positionsCount = this.positions.length;
    
    modalRef.componentInstance.reload.subscribe((val: boolean) => {
      if (val) {
        this.loadPositions();
        modalRef.dismiss();
      }
    });
  }

  deletePosition(position: Position) {
    const modalRef = this.modalService.open(DeleteConfirmationModalComponent, {
      centered: true
    });
    modalRef.componentInstance.message = `Are you sure you want to delete the position "${position.name || position.title}"?`;
    
    modalRef.result.then(
      (confirmed) => {
        if (confirmed && position._id) {
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
      },
      () => {} // Dismissed
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }
}

