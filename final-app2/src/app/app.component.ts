import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
  
    if (navigationEntries.length > 0 && navigationEntries[0].type === 'reload') {
      console.log('AppComponent: Hard browser refresh detected — logging out.');
      this.authService.logout();
      this.router.navigate(['/login']);
    } else {
      console.log('AppComponent: Normal navigation — keeping session.');
    }
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
