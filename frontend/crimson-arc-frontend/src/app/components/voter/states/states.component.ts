import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../../services/api.service';

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

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.apiService.getStates().subscribe({
      next: (states) => {
        this.states = states;
        this.filteredStates = states;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading states:', err);
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

  selectState(state: string) {
    this.router.navigate(['/voter/voting'], { 
      queryParams: { category: 'State', state: state } 
    });
  }

  goBack() {
    this.router.navigate(['/voter/categories']);
  }
}

