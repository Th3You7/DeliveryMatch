import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private jwtHelper = new JwtHelperService();

  constructor(private router: Router) {}

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }

  hasRole(role: string): boolean {
    const roles = localStorage.getItem('roles');
    if (!roles) return false;

    const userRoles = JSON.parse(roles);
    return userRoles.includes(role);
  }

  isDriver(): boolean {
    return this.hasRole('ROLE_DRIVER');
  }

  isSender(): boolean {
    return this.hasRole('ROLE_SENDER');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    this.router.navigate(['/login']);
  }

  getTokenExpirationDate(): Date | null {
    const token = this.getToken();
    if (!token) return null;

    return this.jwtHelper.getTokenExpirationDate(token);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    return this.jwtHelper.isTokenExpired(token);
  }
}
