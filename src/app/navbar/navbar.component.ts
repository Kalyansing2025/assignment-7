import { Component } from '@angular/core';
import { Router } from '@angular/router';


import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { IconsModule } from '@progress/kendo-angular-icons';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [ButtonsModule, IconsModule]
})
export class NavbarComponent {
  constructor(private router: Router) {}

  navigateTo(path: string) {
    // Prevent navigating to the same path again
    if (!this.router.url.startsWith(path)) {
      this.router.navigate([path]);
    }
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  toggleDarkMode(event: Event): void {
    const isDarkMode = (event.target as HTMLInputElement).checked;
    const body = document.body;
  
    if (isDarkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }
  
}
