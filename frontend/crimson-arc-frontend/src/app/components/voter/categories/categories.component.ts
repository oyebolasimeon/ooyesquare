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
    }
    this.loading = false;
  }

  selectCategory(category: 'National' | 'State') {
    if (category === 'National' && !this.votedCategories.national) {
      this.router.navigate(['/voter/voting'], { queryParams: { category: 'National' } });
    } else if (category === 'State' && !this.votedCategories.state) {
      this.router.navigate(['/voter/states']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

