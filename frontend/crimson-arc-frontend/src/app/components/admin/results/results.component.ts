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
import { AdminSidebarComponent } from '../shared/admin-sidebar.component';
import { AdminTopbarComponent } from '../shared/admin-topbar.component';

interface PositionResult {
  position: Position;
  results: any[];
  winner: any;
  isTie: boolean;
  tiedContestants: any[];
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
    ToastModule,
    AdminSidebarComponent,
    AdminTopbarComponent
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
  activeTabIndex = 0; // Track active tab (0 = National, 1 = State)

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
    
    // Load both National and State results
    Promise.all([
      this.apiService.getResults('National').toPromise(),
      this.apiService.getResults('State').toPromise()
    ]).then(([nationalData, stateData]) => {
      // Transform backend response to match frontend expectations
      this.nationalResults = this.transformResults(nationalData);
      this.stateResults = this.transformResults(stateData);
      this.loading = false;
    }).catch((error) => {
      console.error('Error loading results:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load results'
      });
      this.loading = false;
    });
  }

  transformResults(data: any): PositionResult[] {
    if (!data || !data.positions) return [];
    
    return data.positions.map((pos: any) => ({
      position: {
        _id: pos.position._id,
        name: pos.position.title,
        title: pos.position.title,
        category: pos.position.category,
        state: pos.position.state
      },
      results: pos.contestants.map((c: any) => ({
        contestant: {
          _id: c._id,
          firstName: c.firstName,
          lastName: c.lastName,
          maidenName: c.maidenName
        },
        voteCount: c.voteCount,
        percentage: c.percentage
      })),
      isTie: pos.isTie || false,
      tiedContestants: pos.tiedContestants || [],
      winner: pos.winner ? {
        contestant: {
          firstName: pos.winner.firstName,
          lastName: pos.winner.lastName,
          maidenName: pos.winner.maidenName
        },
        voteCount: pos.winner.voteCount
      } : null,
      totalVotes: pos.totalVotes
    }));
  }

  getPositionName(result: PositionResult): string {
    return result.position.state 
      ? `${result.position.name} (${result.position.state})`
      : result.position.name;
  }

  getChartData(result: PositionResult): any {
    const labels = result.results.map((r: any) => `${r.contestant.firstName} ${r.contestant.lastName}`);
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

  onTabChange(event: any) {
    this.activeTabIndex = event.index;
  }

  exportResults() {
    this.exporting = true;
    
    // Determine category based on active tab
    const category = this.activeTabIndex === 0 ? 'National' : 'State';
    
    this.apiService.exportResults(category).subscribe({
      next: (blob: Blob) => {
        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `election-results-${category}-${new Date().toISOString().split('T')[0]}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${category} results exported successfully`
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

