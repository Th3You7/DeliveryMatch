import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface TripHistory {
  id: string;
  departure: string;
  arrival: string;
  parcelType: string;
  status: string;
  parcels: Parcel[];
  tripRequest: {
    sender: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
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
  selector: 'app-driver-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Trip History</h1>
            <p class="mt-2 text-gray-600">Welcome, {{ username }}</p>
          </div>
          <div class="flex space-x-4">
            <button
              (click)="goToDashboard()"
              class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Dashboard
            </button>
            <button
              (click)="logout()"
              class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        <!-- Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="h-6 w-6 text-green-400"
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
                      Total Completed Trips
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ tripHistory.length }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="h-6 w-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    ></path>
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Total Parcels Delivered
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ totalParcelsDelivered }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="h-6 w-6 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Unique Customers
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ uniqueCustomers }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Trip History List -->
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul class="divide-y divide-gray-200">
            <li *ngFor="let trip of tripHistory" class="px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-lg font-medium text-gray-900">
                        {{ trip.departure }} → {{ trip.arrival }}
                      </h3>
                      <p class="text-sm text-gray-500">
                        Type: {{ trip.parcelType }} | Parcels:
                        {{ trip.parcels?.length || 0 }}
                      </p>
                      <p class="text-sm text-gray-500">
                        Status: {{ trip.status }}
                      </p>
                    </div>
                    <div class="flex space-x-2">
                      <button
                        (click)="viewTripDetails(trip)"
                        class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <!-- Empty State -->
          <div *ngIf="tripHistory.length === 0" class="text-center py-12">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">
              No completed trips
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              You haven't completed any trips yet.
            </p>
          </div>
        </div>

        <!-- Trip Details Modal -->
        <div
          *ngIf="selectedTrip"
          class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        >
          <div
            class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-96 overflow-y-auto"
          >
            <div class="mt-3">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                Trip Details
              </h3>
              <div class="space-y-4">
                <div>
                  <strong>Route:</strong> {{ selectedTrip.departure }} →
                  {{ selectedTrip.arrival }}
                </div>
                <div>
                  <strong>Parcel Type:</strong> {{ selectedTrip.parcelType }}
                </div>
                <div><strong>Status:</strong> {{ selectedTrip.status }}</div>
                <div>
                  <strong>Parcels:</strong>
                  {{ selectedTrip.parcels?.length || 0 }}
                </div>
                <div>
                  <strong>Sender:</strong>
                  {{ selectedTrip.tripRequest.sender.firstName }}
                  {{ selectedTrip.tripRequest.sender.lastName }}
                </div>
                <div>
                  <strong>Email:</strong>
                  {{ selectedTrip.tripRequest.sender.email }}
                </div>

                <!-- Parcels and Owners Details -->
                <div *ngIf="selectedTrip.parcels?.length">
                  <strong>Parcel Details:</strong>
                  <div class="mt-2 space-y-2">
                    <div
                      *ngFor="let parcel of selectedTrip.parcels"
                      class="bg-gray-50 p-3 rounded"
                    >
                      <div class="grid grid-cols-2 gap-2 text-sm">
                        <div><strong>Type:</strong> {{ parcel.type }}</div>
                        <div>
                          <strong>Quantity:</strong> {{ parcel.quantity }}
                        </div>
                        <div>
                          <strong>Dimensions:</strong> {{ parcel.width }}x{{
                            parcel.height
                          }}x{{ parcel.weight }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-6 flex justify-end">
                <button
                  (click)="selectedTrip = null"
                  class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class DriverHistoryComponent implements OnInit {
  tripHistory: TripHistory[] = [];
  selectedTrip: TripHistory | null = null;
  username: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.username = this.authService.getUsername();
    this.loadTripHistory();
  }

  logout() {
    this.authService.logout();
  }

  goToDashboard() {
    this.router.navigate(['/driver']);
  }

  loadTripHistory() {
    this.http
      .get<TripHistory[]>('http://localhost:8080/api/driver/trips/history')
      .subscribe({
        next: (trips) => {
          this.tripHistory = trips;
        },
        error: (error) => {
          console.error('Error loading trip history:', error);
        },
      });
  }

  get totalParcelsDelivered(): number {
    return this.tripHistory.reduce(
      (total, trip) => total + (trip.parcels?.length || 0),
      0
    );
  }

  get uniqueCustomers(): number {
    const customers = new Set();
    this.tripHistory.forEach((trip) => {
      trip.parcels?.forEach((parcel) => {
        const customerKey = `${trip.tripRequest.sender.firstName}-${trip.tripRequest.sender.lastName}-${trip.tripRequest.sender.email}`;
        customers.add(customerKey);
      });
    });
    return customers.size;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  viewTripDetails(trip: TripHistory) {
    this.selectedTrip = trip;
  }
}
