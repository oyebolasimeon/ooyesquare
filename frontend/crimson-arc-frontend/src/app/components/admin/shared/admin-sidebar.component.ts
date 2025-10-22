import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <!-- Mobile Overlay -->
    <div class="mobile-overlay" [class.active]="isMobileMenuOpen" (click)="toggleMobileMenu()"></div>
    
    <div class="sidebar" [class.mobile-open]="isMobileMenuOpen">
      <div class="sidebar-header">
        <img src="assets/logo.png" alt="STCOGA Logo" class="logo-image" />
        <span class="logo-text">STCOGA</span>
      </div>

      <div class="nav-menu">
        <div class="nav-item" [class.active]="activeRoute === 'dashboard'" (click)="navigateTo('dashboard')">
          <i class="pi pi-home"></i>
          <span>Dashboard</span>
        </div>
        <div class="nav-item" [class.active]="activeRoute === 'positions'" (click)="navigateTo('positions')">
          <i class="pi pi-briefcase"></i>
          <span>Positions</span>
        </div>
        <div class="nav-item" [class.active]="activeRoute === 'contestants'" (click)="navigateTo('contestants')">
          <i class="pi pi-users"></i>
          <span>Contestants</span>
        </div>
        <div class="nav-item" [class.active]="activeRoute === 'voters'" (click)="navigateTo('voters')">
          <i class="pi pi-user"></i>
          <span>Voters</span>
        </div>
        <div class="nav-item" [class.active]="activeRoute === 'elections'" (click)="navigateTo('elections')">
          <i class="pi pi-calendar"></i>
          <span>Elections</span>
        </div>
        <div class="nav-item" [class.active]="activeRoute === 'results'" (click)="navigateTo('results')">
          <i class="pi pi-chart-bar"></i>
          <span>Results</span>
        </div>
      </div>

      <div class="sidebar-footer">
        <div class="nav-item" (click)="logout()">
          <i class="pi pi-sign-out"></i>
          <span>Logout</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      background: linear-gradient(180deg, #1E40AF 0%, #1E3A8A 100%);
      display: flex;
      flex-direction: column;
      position: fixed;
      height: 100vh;
      box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      position: relative;
    }

    .sidebar::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url('/assets/bg-image.jpeg');
      background-size: cover;
      background-position: center;
      opacity: 0.03;
      pointer-events: none;
      z-index: 0;
    }

    .sidebar > * {
      position: relative;
      z-index: 1;
    }

    .sidebar-header {
      padding: 2rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logo-image {
      width: 50px;
      height: 50px;
      object-fit: contain;
      border-radius: 50%;
      background: white;
      padding: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      letter-spacing: 1px;
    }

    .nav-menu {
      flex: 1;
      padding: 2rem 1rem;
      overflow-y: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      margin-bottom: 0.5rem;
      border-radius: 12px;
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .nav-item i {
      font-size: 1.2rem;
      width: 24px;
    }

    .nav-item span {
      font-weight: 500;
      font-size: 1rem;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      transform: translateX(5px);
    }

    .nav-item.active {
      background: linear-gradient(135deg, #D4A574 0%, #B8935A 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(212, 165, 116, 0.3);
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Mobile Styles */
    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        z-index: 1000;
      }

      .sidebar.mobile-open {
        transform: translateX(0);
      }

      .mobile-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
      }

      .mobile-overlay.active {
        display: block;
      }
    }
  `]
})
export class AdminSidebarComponent {
  @Input() activeRoute: string = '';
  @Output() mobileMenuToggle = new EventEmitter<boolean>();
  isMobileMenuOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  navigateTo(route: string) {
    this.router.navigate([`/admin/${route}`]);
    // Close mobile menu after navigation
    if (this.isMobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.mobileMenuToggle.emit(this.isMobileMenuOpen);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

