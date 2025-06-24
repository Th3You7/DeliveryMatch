import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'driver',
    loadComponent: () =>
      import('./driver/driver-dashboard.component').then(
        (m) => m.DriverDashboardComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'driver/trips',
    loadComponent: () =>
      import('./driver/driver-trips.component').then(
        (m) => m.DriverTripsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'driver/requests',
    loadComponent: () =>
      import('./driver/driver-requests.component').then(
        (m) => m.DriverRequestsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'driver/history',
    loadComponent: () =>
      import('./driver/driver-history.component').then(
        (m) => m.DriverHistoryComponent
      ),
    canActivate: [AuthGuard],
  },
];
