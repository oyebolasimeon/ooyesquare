import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AvatarModule } from 'primeng/avatar';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Position, Contestant, VoteSubmission, Voter } from '../../../models/models';
import { EmptyVotesModalComponent } from './empty-votes-modal.component';
import { ConfirmSubmissionModalComponent } from './confirm-submission-modal.component';
import { ErrorModalComponent } from './error-modal.component';

@Component({
  selector: 'app-voting',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, RadioButtonModule, AvatarModule],
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
  contestantAvatars: { [contestantId: string]: string } = {};
  
  loading = true;
  submitting = false;
  emptyPositions: Position[] = [];
  
  // Expose Object to template
  Object = Object;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.category = params['category'];
      this.state = params['state'];
      
      // Check if user has already voted for this category
      const currentUser = this.authService.currentUserValue;
      if (currentUser && 'votedCategories' in currentUser) {
        const voter = currentUser as Voter;
        const categoryKey = this.category.toLowerCase() as 'national' | 'state';
        
        if (voter.votedCategories[categoryKey]) {
          // Redirect to already-voted page
          this.router.navigate(['/voter/already-voted'], { 
            queryParams: { 
              category: this.category,
              state: this.state 
            } 
          });
          return;
        }
      }
      
      this.loadPositions();
    });
  }

  loadPositions() {
    this.apiService.getPositions(this.category, this.state).subscribe({
      next: (positions) => {
        this.positions = positions;
        positions.forEach(position => {
          if (position._id) {
            this.loadContestants(position._id);
            this.expandedPositions[position._id] = false;
          }
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading positions:', err);
        this.loading = false;
      }
    });
  }

  loadContestants(positionId: string | undefined) {
    if (!positionId) return;
    this.apiService.getContestants(positionId).subscribe({
      next: (contestants) => {
        this.contestants[positionId] = contestants;
        // Generate avatars for each contestant
        contestants.forEach(contestant => {
          if (contestant._id) {
            this.generateContestantAvatar(contestant);
          }
        });
      },
      error: (err) => {
        console.error('Error loading contestants:', err);
      }
    });
  }

  generateContestantAvatar(contestant: Contestant) {
    if (!contestant._id) return;
    const firstName = contestant.firstName || 'Contestant';
    const lastName = contestant.lastName || '';
    const seed = `${firstName}${lastName}`.toLowerCase().replace(/\s/g, '');
    // Using notionists-neutral style for professional/corporate look
    this.contestantAvatars[contestant._id] = `https://api.dicebear.com/7.x/notionists-neutral/svg?seed=${seed}`;
  }

  getContestantAvatar(contestantId: string | undefined): string {
    if (!contestantId) return '';
    return this.contestantAvatars[contestantId] || '';
  }

  togglePosition(positionId: string | undefined) {
    if (!positionId) return;
    this.expandedPositions[positionId] = !this.expandedPositions[positionId];
  }

  selectContestant(positionId: string | undefined, contestantId: string | undefined) {
    if (!positionId || !contestantId) return;
    this.selectedVotes[positionId] = contestantId;
  }

  skipPosition(positionId: string | undefined) {
    if (!positionId) return;
    this.selectedVotes[positionId] = null;
  }

  getSelectedContestant(positionId: string): Contestant | undefined {
    const contestantId = this.selectedVotes[positionId];
    if (!contestantId) return undefined;
    return this.contestants[positionId]?.find(c => c._id === contestantId);
  }

  checkForEmptyVotes(): boolean {
    this.emptyPositions = this.positions.filter(p => 
      p._id && this.selectedVotes[p._id] === undefined
    );
    return this.emptyPositions.length > 0;
  }

  submitVotes() {
    if (this.checkForEmptyVotes()) {
      const modalRef = this.modalService.open(EmptyVotesModalComponent, { 
        size: 'lg',
        backdrop: 'static'
      });
      modalRef.componentInstance.emptyPositions = this.emptyPositions;
      
      modalRef.result.then(
        (result) => {
          if (result) {
            this.openConfirmationModal();
          }
        },
        () => {} // Dismissed
      );
    } else {
      this.openConfirmationModal();
    }
  }

  openConfirmationModal() {
    const modalRef = this.modalService.open(ConfirmSubmissionModalComponent, { 
      size: 'md',
      backdrop: 'static'
    });
    
    modalRef.result.then(
      (result) => {
        if (result) {
          this.finalSubmit();
        }
      },
      () => {} // Dismissed
    );
  }

  finalSubmit() {
    this.submitting = true;
    
    const votes: VoteSubmission[] = this.positions
      .filter(position => position._id) // Only include positions with IDs
      .map(position => ({
        positionId: position._id!,
        contestantId: this.selectedVotes[position._id!] || null
      }));

    this.apiService.submitVotes(votes, this.category, this.state).subscribe({
      next: () => {
        // Update local voter status after successful submission
        this.apiService.getVotingStatus().subscribe({
          next: (status) => {
            this.authService.updateVoterStatus(status.votedCategories, status.hasVoted);
            this.router.navigate(['/voter/thank-you'], { 
              queryParams: { category: this.category } 
            });
          },
          error: () => {
            // Even if status fetch fails, navigate to thank you page
            this.router.navigate(['/voter/thank-you'], { 
              queryParams: { category: this.category } 
            });
          }
        });
      },
      error: (err) => {
        this.submitting = false;
        
        // Check if error is due to already voted
        if (err.status === 400 && err.error?.message?.includes('already voted')) {
          this.router.navigate(['/voter/already-voted'], { 
            queryParams: { 
              category: this.category,
              state: this.state 
            } 
          });
        } else {
          // Show error modal
          const modalRef = this.modalService.open(ErrorModalComponent, {
            centered: true,
            backdrop: 'static'
          });
          modalRef.componentInstance.title = 'Error Submitting Votes';
          modalRef.componentInstance.message = err.error?.message || 'An error occurred. Please try again.';
        }
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

