import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-election-status-modal',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule],
  templateUrl: './election-status-modal.component.html',
  styleUrls: ['./election-status-modal.component.css']
})
export class ElectionStatusModalComponent implements OnInit, OnDestroy {
  @Input() status: any;
  
  countdown: string = '';
  private countdownSubscription?: Subscription;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {
    if (this.status && !this.status.isActive) {
      this.startCountdown();
    }
  }

  ngOnDestroy() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  startCountdown() {
    this.updateCountdown();
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.updateCountdown();
    });
  }

  updateCountdown() {
    const now = new Date().getTime();
    const start = new Date(this.status.startDate).getTime();
    const end = new Date(this.status.endDate).getTime();

    let targetTime: number;
    let prefix: string;

    if (now < start) {
      // Election hasn't started
      targetTime = start;
      prefix = 'Starts in: ';
    } else if (now > end) {
      // Election has ended
      this.countdown = 'Election has ended';
      if (this.countdownSubscription) {
        this.countdownSubscription.unsubscribe();
      }
      return;
    } else {
      // Election should be active but is disabled
      this.countdown = 'Election is temporarily disabled';
      if (this.countdownSubscription) {
        this.countdownSubscription.unsubscribe();
      }
      return;
    }

    const distance = targetTime - now;

    if (distance < 0) {
      this.countdown = 'Election is starting...';
      if (this.countdownSubscription) {
        this.countdownSubscription.unsubscribe();
      }
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    let countdownText = prefix;
    if (days > 0) {
      countdownText += `${days} day${days > 1 ? 's' : ''} `;
    }
    if (hours > 0 || days > 0) {
      countdownText += `${hours} hour${hours > 1 ? 's' : ''} `;
    }
    if (minutes > 0 || hours > 0 || days > 0) {
      countdownText += `${minutes} minute${minutes > 1 ? 's' : ''} `;
    }
    countdownText += `${seconds} second${seconds > 1 ? 's' : ''}`;

    this.countdown = countdownText;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusIcon(): string {
    if (!this.status) return 'pi-info-circle';
    
    const now = new Date().getTime();
    const start = new Date(this.status.startDate).getTime();
    const end = new Date(this.status.endDate).getTime();

    if (!this.status.isScheduledActive) {
      return 'pi-ban';
    } else if (now < start) {
      return 'pi-clock';
    } else if (now > end) {
      return 'pi-check-circle';
    } else {
      return 'pi-pause';
    }
  }

  getStatusClass(): string {
    if (!this.status) return 'info';
    
    const now = new Date().getTime();
    const start = new Date(this.status.startDate).getTime();
    const end = new Date(this.status.endDate).getTime();

    if (!this.status.isScheduledActive) {
      return 'disabled';
    } else if (now < start) {
      return 'upcoming';
    } else if (now > end) {
      return 'ended';
    } else {
      return 'paused';
    }
  }

  getStatusTitle(): string {
    if (!this.status) return 'Election Status';
    
    const now = new Date().getTime();
    const start = new Date(this.status.startDate).getTime();
    const end = new Date(this.status.endDate).getTime();

    if (!this.status.isScheduledActive) {
      return 'Election Disabled';
    } else if (now < start) {
      return 'Election Not Started';
    } else if (now > end) {
      return 'Election Ended';
    } else {
      return 'Election Paused';
    }
  }

  close() {
    this.activeModal.close();
  }
}

