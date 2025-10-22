import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-topbar',
  standalone: true,
  imports: [CommonModule, ButtonModule, AvatarModule],
  template: `
    <div class="topbar">
      <div class="page-title">
        <button pButton icon="pi pi-bars" (click)="toggleMenu.emit()" class="menu-toggle p-button-rounded p-button-text"></button>
        <i [class]="'pi ' + icon" style="font-size: 1.5rem; margin-right: 1rem;"></i>
        <h2>{{ title }}</h2>
      </div>
      <div class="topbar-actions">
        <button pButton icon="pi pi-bell" class="p-button-rounded p-button-text"></button>
        <button pButton icon="pi pi-cog" class="p-button-rounded p-button-text"></button>
        <div class="user-avatar">
          <p-avatar [image]="adminAvatarUrl" shape="circle" [style]="{'width': '40px', 'height': '40px'}"></p-avatar>
          <span class="user-name">{{ adminName }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .topbar {
      background: white;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .page-title {
      display: flex;
      align-items: center;
    }

    .page-title h2 {
      margin: 0;
      color: #1E40AF;
      font-size: 1.75rem;
      font-weight: 700;
    }

    .page-title i {
      color: #1E40AF;
    }

    .topbar-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .topbar-actions button {
      color: #1F2937 !important;
    }

    .user-avatar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding-left: 1rem;
      border-left: 2px solid #F9FAFB;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    ::ng-deep .user-avatar .p-avatar {
      border: 2px solid white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .user-avatar:hover ::ng-deep .p-avatar {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(30, 64, 175, 0.2);
    }

    .user-name {
      font-weight: 600;
      color: #1F2937;
    }

    .menu-toggle {
      display: none;
      margin-right: 1rem;
      color: #1E40AF !important;
    }

    @media (max-width: 768px) {
      .menu-toggle {
        display: inline-flex;
      }
      .topbar {
        padding: 1rem;
      }

      .page-title h2 {
        font-size: 1.25rem;
      }

      .user-name {
        display: none;
      }
    }
  `]
})
export class AdminTopbarComponent implements OnInit {
  @Input() title: string = '';
  @Input() icon: string = 'pi-home';
  @Output() toggleMenu = new EventEmitter<void>();
  
  adminAvatarUrl = '';
  adminName = 'Admin';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && 'username' in currentUser) {
      const username = currentUser.username;
      this.adminName = (typeof username === 'string' ? username : 'Admin') || 'Admin';
      const seed = this.adminName.toLowerCase().replace(/\s/g, '');
      this.adminAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    } else {
      this.adminAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=admin`;
    }
  }
}

