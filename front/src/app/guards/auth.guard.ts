import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private jwtHelper = new JwtHelperService();

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    const roles = localStorage.getItem('roles');

    // Check if token exists
    if (!token) {
      this.clearAuthData();
      this.router.navigate(['/login']);
      return false;
    }

    // Check if token is expired
    if (this.jwtHelper.isTokenExpired(token)) {
      this.clearAuthData();
      this.router.navigate(['/login']);
      return false;
    }

    // Check if user has required role (DRIVER for driver routes)
    if (!roles) {
      this.clearAuthData();
      this.router.navigate(['/login']);
      return false;
    }

    const userRoles = JSON.parse(roles);
    if (!userRoles.includes('ROLE_DRIVER')) {
      this.clearAuthData();
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
  }
}
