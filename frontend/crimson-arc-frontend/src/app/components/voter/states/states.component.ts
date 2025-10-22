import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Voter } from '../../../models/models';

@Component({
  selector: 'app-states',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, InputTextModule],
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.css']
})
export class StatesComponent implements OnInit {
  states: string[] = [];
  filteredStates: string[] = [];
  searchTerm = '';
  loading = true;
  hasVotedState = false;
  alphabetLetters: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user has already voted for state category
    const currentUser = this.authService.currentUserValue;
    if (currentUser && 'votedCategories' in currentUser) {
      const voter = currentUser as Voter;
      this.hasVotedState = voter.votedCategories.state;
      
      // If already voted, redirect to already-voted page
      if (this.hasVotedState) {
        this.router.navigate(['/voter/already-voted'], { 
          queryParams: { category: 'State' } 
        });
        return;
      }
    }
    
    this.apiService.getAvailableStates().subscribe({
      next: (states) => {
        this.states = states.sort(); // Sort alphabetically
        this.filteredStates = states.sort();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading available states:', err);
        this.loading = false;
      }
    });
  }

  filterStates() {
    if (!this.searchTerm) {
      this.filteredStates = this.states;
    } else {
      this.filteredStates = this.states.filter(state =>
        state.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.filterStates();
  }

  hasStateStartingWith(letter: string): boolean {
    return this.filteredStates.some(state => 
      state.toUpperCase().startsWith(letter)
    );
  }

  scrollToLetter(letter: string) {
    this.searchTerm = letter;
    this.filterStates();
  }

  selectState(state: string) {
    this.router.navigate(['/voter/voting'], { 
      queryParams: { category: 'State', state: state } 
    });
  }

  goBack() {
    this.router.navigate(['/voter/categories']);
  }
}

