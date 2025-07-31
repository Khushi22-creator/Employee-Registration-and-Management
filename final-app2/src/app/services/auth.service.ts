import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login(): void {
    localStorage.setItem('loggedIn', 'true');
  }

  isLoggedIn(): boolean {
    const status = localStorage.getItem('loggedIn') === 'true';
    console.log('AuthService - isLoggedIn:', status);
    return status;
  }
  
  
  logout(): void {
    localStorage.removeItem('loggedIn');
  }
}
