import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

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
  voterEmail = '';
  voterPhone = '';
  
  // Admin credentials
  adminEmail = '';
  adminPassword = '';
  
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  switchLoginType(type: 'voter' | 'admin') {
    this.loginType = type;
    this.error = '';
  }

  voterLogin() {
    this.error = '';
    this.loading = true;

    this.authService.voterLogin(this.voterEmail, this.voterPhone)
      .subscribe({
        next: (user) => {
          this.loading = false;
          this.router.navigate(['/voter/categories']);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Login failed. Please check your credentials.';
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

