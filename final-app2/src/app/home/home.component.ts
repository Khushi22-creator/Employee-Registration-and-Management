import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      console.log('HomeComponent: not logged in, redirecting to login.');
      this.router.navigate(['/login']);
    } else {
      console.log('HomeComponent: logged in, access granted.');
    }
  }
}
