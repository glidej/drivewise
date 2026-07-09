import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface NavItem {
  label: string;
  path: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly navItems: NavItem[] = [
    { label: 'Learn', path: '/learn' },
    { label: 'Buy', path: '/buy' },
    { label: 'Sell', path: '/sell' },
  ];
}
