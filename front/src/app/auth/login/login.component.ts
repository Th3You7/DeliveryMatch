import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  username: string;
  roles: string[];
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginData: LoginRequest = {
        username: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value,
      };

      this.http
        .post<LoginResponse>('http://localhost:8080/api/auth/login', loginData)
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            // Store token in localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('username', response.username);
            localStorage.setItem('roles', JSON.stringify(response.roles));
            console.log(response);
            // Navigate based on user role
            if (response.roles.includes('ROLE_DRIVER')) {
              this.router.navigate(['/driver']);
            } else {
              // For now, redirect to driver dashboard for any other role
              this.router.navigate(['/driver']);
            }
          },
          error: (error) => {
            this.isLoading = false;
            if (error.status === 401) {
              this.errorMessage = 'Invalid username or password';
            } else {
              this.errorMessage = 'An error occurred. Please try again.';
            }
          },
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (control?.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (field === 'username' && control?.hasError('minlength')) {
      return 'Username must be at least 3 characters long';
    }
    if (field === 'password' && control?.hasError('minlength')) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  }

  getFieldClass(field: string): string {
    const control = this.loginForm.get(field);
    if (control?.invalid && control?.touched) {
      return 'input-error';
    }
    return '';
  }
}
