import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from './core/services/auth.service';

interface NavItem {
  label: string;
  path: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly authService = inject(AuthService);

  protected readonly authSnapshot = this.authService.snapshot;
  protected readonly navItems: NavItem[] = [
    { label: 'Learn', path: '/learn' },
    { label: 'Buy', path: '/buy' },
    { label: 'Sell', path: '/sell' },
    { label: 'Profile', path: '/profile' },
  ];

  protected readonly footerLinks: NavItem[] = [
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Privacy Policy', path: '/privacy' },
  ];

  protected signInDemo(): void {
    this.authService.signInDemo();
  }

  protected resumeDemoSession(): void {
    this.authService.resumeDemoSession();
  }

  protected signOut(): void {
    this.authService.signOut();
  }
}
