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
import { HttpClient } from '@angular/common/http';

interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        userType: ['DRIVER', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (confirmPassword) {
        confirmPassword.setErrors(null);
      }
      return null;
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const registerData: RegisterRequest = {
        username: this.registerForm.get('username')?.value,
        email: this.registerForm.get('email')?.value,
        firstName: this.registerForm.get('firstName')?.value,
        lastName: this.registerForm.get('lastName')?.value,
        password: this.registerForm.get('password')?.value,
        userType: this.registerForm.get('userType')?.value,
      };

      this.http
        .post('http://localhost:8080/api/auth/register', registerData)
        .subscribe({
          next: (response) => {
            console.log('Registration successful:', response);
            this.isLoading = false;
            this.successMessage =
              'Registration successful! Please check your email to verify your account.';

            // Redirect to login after 3 seconds
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000);
          },
          error: (error) => {
            console.error('Registration error:', error);
            this.isLoading = false;

            if (error.status === 409) {
              this.errorMessage =
                error.error?.message || 'Username or email already exists.';
            } else if (error.status === 400) {
              this.errorMessage =
                error.error?.message ||
                'Please check your input and try again.';
            } else if (error.status === 0) {
              this.errorMessage =
                'Unable to connect to server. Please check your connection.';
            } else {
              this.errorMessage =
                error.error?.message || 'An error occurred. Please try again.';
            }
          },
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field);
    if (control?.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (field === 'email' && control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field === 'password' && control?.hasError('minlength')) {
      return 'Password must be at least 6 characters long';
    }
    if (field === 'confirmPassword' && control?.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    if (
      (field === 'firstName' || field === 'lastName') &&
      control?.hasError('minlength')
    ) {
      return `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } must be at least 2 characters long`;
    }
    if (field === 'username' && control?.hasError('minlength')) {
      return 'Username must be at least 3 characters long';
    }
    return '';
  }

  getFieldClass(field: string): string {
    const control = this.registerForm.get(field);
    if (control?.invalid && control?.touched) {
      return 'input-error';
    }
    return '';
  }
}
