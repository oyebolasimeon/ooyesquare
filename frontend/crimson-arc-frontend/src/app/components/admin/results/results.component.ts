import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Position } from '../../../models/models';

interface PositionResult {
  position: Position;
  results: any[];
  winner: any;
  totalVotes: number;
}

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    CommonModule, 
    CardModule, 
    ButtonModule, 
    TableModule,
    TabViewModule,
    TagModule,
    ChartModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  loading = true;
  nationalResults: PositionResult[] = [];
  stateResults: PositionResult[] = [];
  exporting = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadResults();
  }

  loadResults() {
    this.loading = true;
    this.apiService.getResults().subscribe({
      next: (data: any) => {
        // Handle both array and object responses
        const results = Array.isArray(data) ? data : (data.positions || []);
        // Separate results by category
        this.nationalResults = results.filter((r: any) => 
          r.position.category === 'National'
        );
        this.stateResults = results.filter((r: any) => 
          r.position.category === 'State'
        );
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading results:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load results'
        });
        this.loading = false;
      }
    });
  }

  getPositionName(result: PositionResult): string {
    return result.position.state 
      ? `${result.position.name} (${result.position.state})`
      : result.position.name;
  }

  getChartData(result: PositionResult): any {
    const labels = result.results.map((r: any) => r.contestant.name);
    const data = result.results.map((r: any) => r.voteCount);
    
    return {
      labels: labels,
      datasets: [
        {
          label: 'Votes',
          data: data,
          backgroundColor: [
            'rgba(30, 64, 175, 0.7)',
            'rgba(59, 130, 246, 0.7)',
            'rgba(212, 165, 116, 0.7)',
            'rgba(184, 147, 90, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(139, 92, 246, 0.7)',
            'rgba(245, 158, 11, 0.7)',
          ],
          borderColor: [
            'rgba(30, 64, 175, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(212, 165, 116, 1)',
            'rgba(184, 147, 90, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(245, 158, 11, 1)',
          ],
          borderWidth: 2
        }
      ]
    };
  }

  getChartOptions(): any {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    };
  }

  getVotePercentage(votes: number, total: number): string {
    if (total === 0) return '0.0';
    return ((votes / total) * 100).toFixed(1);
  }

  exportResults() {
    this.exporting = true;
    this.apiService.exportResults().subscribe({
      next: (blob: Blob) => {
        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `election-results-${new Date().toISOString().split('T')[0]}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Results exported successfully'
        });
        this.exporting = false;
      },
      error: (error) => {
        console.error('Error exporting results:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to export results'
        });
        this.exporting = false;
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

