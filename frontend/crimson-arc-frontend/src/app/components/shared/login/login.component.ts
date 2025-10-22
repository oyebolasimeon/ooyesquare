import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/auth.service';
import { ActiveSessionModalComponent } from './active-session-modal.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginType: 'voter' | 'admin' = 'voter';
  
  // Voter credentials
  voterMaidenName = '';
  voterPhone = '';
  
  // Admin credentials
  adminEmail = '';
  adminPassword = '';
  
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  switchLoginType(type: 'voter' | 'admin') {
    this.loginType = type;
    this.error = '';
  }

  voterLogin() {
    this.error = '';
    this.loading = true;

    this.authService.voterLogin(this.voterMaidenName, this.voterPhone)
      .subscribe({
        next: (user) => {
          this.loading = false;
          this.router.navigate(['/voter/categories']);
        },
        error: (err) => {
          this.loading = false;
          
          // Check if error is due to active session (403)
          if (err.status === 403 && err.error?.sessionInfo) {
            // Show active session modal
            const modalRef = this.modalService.open(ActiveSessionModalComponent, {
              centered: true,
              backdrop: 'static',
              size: 'lg'
            });
            modalRef.componentInstance.message = err.error.message;
            modalRef.componentInstance.sessionInfo = err.error.sessionInfo;
          } else {
            // Show regular error message
            this.error = err.error?.message || 'Login failed. Please check your credentials.';
          }
        }
      });
  }

  adminLogin() {
    this.error = '';
    this.loading = true;

    this.authService.adminLogin(this.adminEmail, this.adminPassword)
      .subscribe({
        next: (user) => {
          this.loading = false;
          this.router.navigate(['/admin/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Login failed. Please check your credentials.';
        }
      });
  }
}

