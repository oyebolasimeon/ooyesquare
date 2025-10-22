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
import { DeleteConfirmationModalComponent } from '../shared/delete-confirmation-modal.component';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Contestant, Position } from '../../../models/models';
import { AdminSidebarComponent } from '../shared/admin-sidebar.component';
import { AdminTopbarComponent } from '../shared/admin-topbar.component';
import { ContestantModalComponent } from './contestant-modal.component';

@Component({
  selector: 'app-contestants',
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
  templateUrl: './contestants.component.html',
  styleUrls: ['./contestants.component.css']
})
export class ContestantsComponent implements OnInit {
  contestants: Contestant[] = [];
  filteredContestants: Contestant[] = [];
  positions: Position[] = [];
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
    this.loadData();
  }

  loadData() {
    this.loading = true;
    Promise.all([
      this.apiService.getContestants().toPromise(),
      this.apiService.getPositions().toPromise()
    ]).then(([contestants, positions]) => {
      this.contestants = contestants || [];
      this.filteredContestants = contestants || [];
      this.positions = positions || [];
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

  filterContestants() {
    if (!this.searchText.trim()) {
      this.filteredContestants = this.contestants;
      return;
    }

    const searchLower = this.searchText.toLowerCase().trim();
    this.filteredContestants = this.contestants.filter(contestant => {
      const fullName = `${contestant.firstName} ${contestant.lastName}`.toLowerCase();
      const positionTitle = typeof contestant.position === 'object' ? 
        (contestant.position?.title?.toLowerCase() || '') : '';
      const positionCategory = typeof contestant.position === 'object' ? 
        (contestant.position?.category?.toLowerCase() || '') : '';

      return (
        contestant.firstName?.toLowerCase().includes(searchLower) ||
        contestant.lastName?.toLowerCase().includes(searchLower) ||
        contestant.maidenName?.toLowerCase().includes(searchLower) ||
        fullName.includes(searchLower) ||
        positionTitle.includes(searchLower) ||
        positionCategory.includes(searchLower)
      );
    });
  }

  clearSearch() {
    this.searchText = '';
    this.filteredContestants = this.contestants;
  }

  getPositionName(contestant: Contestant): string {
    // Check if position is populated (object) or just an ID (string)
    if (typeof contestant.position === 'object' && contestant.position) {
      const pos = contestant.position as Position;
      const posName = pos.title || pos.name || 'Unknown Position';
      return pos.state ? `${posName} (${pos.state})` : posName;
    }
    // Fallback to looking up by ID
    const positionId = contestant.position as string || contestant.positionId;
    const position = this.positions.find(p => p._id === positionId);
    if (!position) return 'Unknown Position';
    const posName = position.name || position.title || 'Unknown Position';
    return position.state ? `${posName} (${position.state})` : posName;
  }

  getPositionCategory(contestant: Contestant): string {
    // Check if position is populated (object) or just an ID (string)
    if (typeof contestant.position === 'object' && contestant.position) {
      const pos = contestant.position as Position;
      return pos.category || 'Unknown';
    }
    // Fallback to looking up by ID
    const positionId = contestant.position as string || contestant.positionId;
    const position = this.positions.find(p => p._id === positionId);
    return position?.category || 'Unknown';
  }

  openNewDialog() {
    const modalRef = this.modalService.open(ContestantModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.positions = this.positions;
    
    modalRef.componentInstance.reload.subscribe((val: boolean) => {
      if (val) {
        this.loadData();
        modalRef.dismiss();
      }
    });
  }

  openEditDialog(contestant: Contestant) {
    const modalRef = this.modalService.open(ContestantModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.contestant = contestant;
    modalRef.componentInstance.positions = this.positions;
    
    modalRef.componentInstance.reload.subscribe((val: boolean) => {
      if (val) {
        this.loadData();
        modalRef.dismiss();
      }
    });
  }

  deleteContestant(contestant: Contestant) {
    const fullName = `${contestant.firstName} ${contestant.lastName}`;
    const modalRef = this.modalService.open(DeleteConfirmationModalComponent, {
      centered: true
    });
    modalRef.componentInstance.message = `Are you sure you want to delete contestant "${fullName}"?`;
    
    modalRef.result.then(
      (confirmed) => {
        if (confirmed && contestant._id) {
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

