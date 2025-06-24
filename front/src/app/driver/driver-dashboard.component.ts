import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

interface Trip {
  id: string;
  departure: string;
  arrival: string;
  parcelType: string;
  status: string;
  parcels: Parcel[];
}

interface Parcel {
  id?: string;
  width: number;
  height: number;
  weight: number;
  quantity: number;
  type: string;
  tripId?: string;
  tripRequestId?: string;
}

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-6">
            <h1 class="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
            <div class="flex items-center space-x-4">
              <span class="text-gray-600">Welcome, {{ username }}</span>
              <div class="flex space-x-4">
                <button
                  routerLink="/driver/trips"
                  class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  My Trips
                </button>
                <button
                  routerLink="/driver/requests"
                  class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Trip Requests
                </button>
                <button
                  routerLink="/driver/history"
                  class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                >
                  Trip History
                </button>
                <button
                  (click)="logout()"
                  class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Active Trips Card -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-6 w-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      ></path>
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">
                        Active Trips
                      </dt>
                      <dd class="text-lg font-medium text-gray-900">
                        {{ activeTripsCount }}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pending Requests Card -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-6 w-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">
                        Pending Requests
                      </dt>
                      <dd class="text-lg font-medium text-gray-900">
                        {{ pendingRequestsCount }}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <!-- Completed Trips Card -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-6 w-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">
                        Completed Trips
                      </dt>
                      <dd class="text-lg font-medium text-gray-900">
                        {{ completedTripsCount }}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Trips -->
          <div class="mt-8">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Recent Trips</h2>
            <div class="bg-white shadow overflow-hidden sm:rounded-md">
              <ul class="divide-y divide-gray-200">
                <li *ngFor="let trip of recentTrips" class="px-6 py-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div class="flex-shrink-0">
                        <svg
                          class="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          ></path>
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                        </svg>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ trip.departure }} → {{ trip.arrival }}
                        </div>
                        <div class="text-sm text-gray-500">
                          Parcel Type: {{ trip.parcelType }}
                        </div>
                      </div>
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ trip.parcels?.length || 0 }} parcels
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [],
})
export class DriverDashboardComponent implements OnInit {
  activeTripsCount = 0;
  pendingRequestsCount = 0;
  completedTripsCount = 0;
  recentTrips: Trip[] = [];
  username: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.username = this.authService.getUsername();
    this.loadDashboardData();
  }

  logout() {
    this.authService.logout();
  }

  loadDashboardData() {
    // Load active trips count
    this.http
      .get<Trip[]>('http://localhost:8080/api/driver/trips/active')
      .subscribe({
        next: (trips) => {
          this.activeTripsCount = trips.length;
          this.recentTrips = trips.slice(0, 5); // Get first 5 trips
        },
        error: (error) => {
          console.error('Error loading active trips:', error);
        },
      });

    // Load pending requests count
    this.http
      .get<any[]>('http://localhost:8080/api/driver/requests/pending')
      .subscribe({
        next: (requests) => {
          this.pendingRequestsCount = requests.length;
        },
        error: (error) => {
          console.error('Error loading pending requests:', error);
        },
      });

    // Load completed trips count
    this.http
      .get<Trip[]>('http://localhost:8080/api/driver/trips/completed')
      .subscribe({
        next: (trips) => {
          this.completedTripsCount = trips.length;
        },
        error: (error) => {
          console.error('Error loading completed trips:', error);
        },
      });
  }
}
