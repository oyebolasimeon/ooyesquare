import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ChartModule, TableModule, TagModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = {
    totalPositions: 0,
    totalContestants: 0,
    totalVoters: 0,
    totalVotes: 0
  };

  recentActivities: any[] = [];
  electionStatus: any = null;
  loading = true;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    
    // Load all data in parallel
    Promise.all([
      this.apiService.getPositions().toPromise(),
      this.apiService.getContestants().toPromise(),
      this.apiService.getVoters().toPromise(),
      this.apiService.getElectionSettings().toPromise()
    ]).then(([positions, contestants, voters, settings]) => {
      this.stats.totalPositions = positions?.length || 0;
      this.stats.totalContestants = contestants?.length || 0;
      this.stats.totalVoters = voters?.length || 0;
      this.electionStatus = settings;
      this.loading = false;
    }).catch(error => {
      console.error('Error loading dashboard data:', error);
      this.loading = false;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateTo(route: string) {
    this.router.navigate([`/admin/${route}`]);
  }
}

