import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { ElectionSettings } from '../../../models/models';

@Component({
  selector: 'app-elections',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    CardModule, 
    ButtonModule, 
    CalendarModule,
    InputSwitchModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './elections.component.html',
  styleUrls: ['./elections.component.css']
})
export class ElectionsComponent implements OnInit {
  loading = true;
  saving = false;

  settings: Partial<ElectionSettings> = {
    startDate: undefined,
    endDate: undefined,
    isActive: false
  };

  minDate: Date = new Date();

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.loading = true;
    this.apiService.getElectionSettings().subscribe({
      next: (settingsArray) => {
        if (settingsArray && settingsArray.length > 0) {
          const settings = settingsArray[0]; // Get first election settings
          this.settings = {
            ...settings,
            startDate: settings.startDate ? new Date(settings.startDate) : undefined,
            endDate: settings.endDate ? new Date(settings.endDate) : undefined
          };
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading election settings:', error);
        this.loading = false;
      }
    });
  }

  saveSettings() {
    if (!this.settings.startDate || !this.settings.endDate) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please set both start and end dates'
      });
      return;
    }

    if (this.settings.startDate >= this.settings.endDate) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'End date must be after start date'
      });
      return;
    }

    this.saving = true;
    this.apiService.updateElectionSettings(this.settings).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Election settings saved successfully'
        });
        this.saving = false;
        this.loadSettings();
      },
      error: (error: any) => {
        console.error('Error saving election settings:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save election settings'
        });
        this.saving = false;
      }
    });
  }

  getElectionStatus(): string {
    if (!this.settings.startDate || !this.settings.endDate) {
      return 'Not Configured';
    }

    const now = new Date();
    const start = new Date(this.settings.startDate);
    const end = new Date(this.settings.endDate);

    if (now < start) {
      return 'Upcoming';
    } else if (now >= start && now <= end) {
      return 'Active';
    } else {
      return 'Ended';
    }
  }

  getStatusSeverity(): string {
    const status = this.getElectionStatus();
    switch (status) {
      case 'Active': return 'success';
      case 'Upcoming': return 'info';
      case 'Ended': return 'danger';
      default: return 'warning';
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }
}

