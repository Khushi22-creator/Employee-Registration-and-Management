import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Adjust if path is different

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  showPassword: boolean = false; 
  errorMessage: string = '';
  infoMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.clearMessages();

    if (this.username === 'khushi_d' && this.password === 'Q8nd6sah!') {
      this.authService.login(); 
      localStorage.setItem('userRole', 'User');

      this.router.navigate(['/home']); 
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }

  forgotPassword() {
    this.clearMessages();

    if (this.username === 'khushi_d') {
      this.infoMessage = 'Password reset link has been sent to your email.';
    } else if (this.username.trim() === '') {
      this.errorMessage = 'Please enter your username first.';
    } else {
      this.errorMessage = 'Username not found.';
    }
  }

  private clearMessages() {
    this.errorMessage = '';
    this.infoMessage = '';
  }
}
