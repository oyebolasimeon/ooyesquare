import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Position, Contestant, VoteSubmission } from '../../../models/models';

@Component({
  selector: 'app-voting',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, RadioButtonModule, AvatarModule, DialogModule],
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})
export class VotingComponent implements OnInit {
  category: string = '';
  state?: string;
  positions: Position[] = [];
  contestants: { [positionId: string]: Contestant[] } = {};
  selectedVotes: { [positionId: string]: string | null } = {};
  expandedPositions: { [positionId: string]: boolean } = {};
  
  loading = true;
  submitting = false;
  showEmptyWarning = false;
  showFinalConfirmation = false;
  emptyPositions: Position[] = [];
  
  // Expose Object to template
  Object = Object;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.category = params['category'];
      this.state = params['state'];
      this.loadPositions();
    });
  }

  loadPositions() {
    this.apiService.getPositions(this.category, this.state).subscribe({
      next: (positions) => {
        this.positions = positions;
        positions.forEach(position => {
          this.loadContestants(position._id);
          this.expandedPositions[position._id] = false;
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading positions:', err);
        this.loading = false;
      }
    });
  }

  loadContestants(positionId: string) {
    this.apiService.getContestants(positionId).subscribe({
      next: (contestants) => {
        this.contestants[positionId] = contestants;
      },
      error: (err) => {
        console.error('Error loading contestants:', err);
      }
    });
  }

  togglePosition(positionId: string) {
    this.expandedPositions[positionId] = !this.expandedPositions[positionId];
  }

  selectContestant(positionId: string, contestantId: string) {
    this.selectedVotes[positionId] = contestantId;
  }

  skipPosition(positionId: string) {
    this.selectedVotes[positionId] = null;
  }

  getSelectedContestant(positionId: string): Contestant | undefined {
    const contestantId = this.selectedVotes[positionId];
    if (!contestantId) return undefined;
    return this.contestants[positionId]?.find(c => c._id === contestantId);
  }

  checkForEmptyVotes(): boolean {
    this.emptyPositions = this.positions.filter(p => 
      this.selectedVotes[p._id] === undefined
    );
    return this.emptyPositions.length > 0;
  }

  submitVotes() {
    if (this.checkForEmptyVotes()) {
      this.showEmptyWarning = true;
    } else {
      this.showFinalConfirmation = true;
    }
  }

  proceedWithEmpty() {
    this.showEmptyWarning = false;
    this.showFinalConfirmation = true;
  }

  finalSubmit() {
    this.submitting = true;
    
    const votes: VoteSubmission[] = this.positions.map(position => ({
      positionId: position._id,
      contestantId: this.selectedVotes[position._id] || null
    }));

    this.apiService.submitVotes(votes, this.category, this.state).subscribe({
      next: () => {
        this.showFinalConfirmation = false;
        this.router.navigate(['/voter/thank-you'], { 
          queryParams: { category: this.category } 
        });
      },
      error: (err) => {
        this.submitting = false;
        alert('Error submitting votes: ' + (err.error?.message || 'Please try again'));
      }
    });
  }

  goBack() {
    if (this.category === 'State') {
      this.router.navigate(['/voter/states']);
    } else {
      this.router.navigate(['/voter/categories']);
    }
  }
}

