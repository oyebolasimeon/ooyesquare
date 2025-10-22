import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { Voter } from '../../../models/models';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, AvatarModule, TagModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  voter: Voter | null = null;
  votedCategories = {
    national: false,
    state: false
  };
  loading = true;
  avatarUrl = '';

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && 'phoneNumber' in currentUser) {
      this.voter = currentUser as Voter;
      this.votedCategories = currentUser.votedCategories;
      
      // Generate random avatar using DiceBear API
      const firstName = this.voter.firstName || 'User';
      const lastName = this.voter.lastName || '';
      const seed = `${firstName}${lastName}`.toLowerCase().replace(/\s/g, '');
      this.avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
      
      // Refresh voting status from backend to ensure it's up to date
      this.apiService.getVotingStatus().subscribe({
        next: (status) => {
          this.votedCategories = status.votedCategories;
          this.authService.updateVoterStatus(status.votedCategories, status.hasVoted);
        },
        error: (err) => {
          console.error('Error fetching voting status:', err);
        }
      });
    }
    this.loading = false;
  }

  selectCategory(category: 'National' | 'State') {
    const categoryKey = category.toLowerCase() as 'national' | 'state';
    
    // Check if already voted in this category
    if (this.votedCategories[categoryKey]) {
      this.router.navigate(['/voter/already-voted'], { 
        queryParams: { category: category } 
      });
      return;
    }
    
    // Proceed to voting
    if (category === 'National') {
      this.router.navigate(['/voter/voting'], { queryParams: { category: 'National' } });
    } else if (category === 'State') {
      this.router.navigate(['/voter/states']);
    }
  }

  logout() {
    const logoutResult = this.authService.logout();
    
    // If logout returns an Observable (voter with session), subscribe to it
    if (logoutResult) {
      logoutResult.subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Logout error:', err);
          // Still navigate to login even if API call fails
          this.router.navigate(['/login']);
        }
      });
    } else {
      // Admin or already logged out
      this.router.navigate(['/login']);
    }
  }
}

