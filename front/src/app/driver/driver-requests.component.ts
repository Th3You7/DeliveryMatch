import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface TripRequest {
  id: string;
  status: string;
  trip: {
    id: string;
    departure: string;
    arrival: string;
    parcelType: string;
    parcels: Parcel[];
  };
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
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
  selector: 'app-driver-requests',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Trip Requests</h1>
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

        <!-- Filter Tabs -->
        <div class="mb-6">
          <nav class="flex space-x-8">
            <button
              (click)="setFilter('pending')"
              [class]="
                filter === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              "
              class="border-b-2 py-2 px-1 text-sm font-medium"
            >
              Pending ({{ pendingRequests.length }})
            </button>
            <button
              (click)="setFilter('accepted')"
              [class]="
                filter === 'accepted'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              "
              class="border-b-2 py-2 px-1 text-sm font-medium"
            >
              Accepted ({{ acceptedRequests.length }})
            </button>
            <button
              (click)="setFilter('declined')"
              [class]="
                filter === 'declined'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              "
              class="border-b-2 py-2 px-1 text-sm font-medium"
            >
              Declined ({{ declinedRequests.length }})
            </button>
          </nav>
        </div>

        <!-- Requests List -->
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul class="divide-y divide-gray-200">
            <li *ngFor="let request of filteredRequests" class="px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-lg font-medium text-gray-900">
                        {{ request.trip.departure }} →
                        {{ request.trip.arrival }}
                      </h3>
                      <p class="text-sm text-gray-500">
                        From: {{ request.sender.firstName }}
                        {{ request.sender.lastName }} ({{
                          request.sender.email
                        }})
                      </p>
                      <p class="text-sm text-gray-500">
                        Parcel Type: {{ request.trip.parcelType }} | Parcels:
                        {{ request.trip.parcels?.length || 0 }}
                      </p>
                      <div class="mt-2">
                        <span
                          [class]="getStatusClass(request.status)"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        >
                          {{ request.status }}
                        </span>
                      </div>
                    </div>
                    <div class="flex space-x-2">
                      <button
                        (click)="viewRequestDetails(request)"
                        class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                      <button
                        *ngIf="request.status === 'PENDING'"
                        (click)="acceptRequest(request.id)"
                        class="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Accept
                      </button>
                      <button
                        *ngIf="request.status === 'PENDING'"
                        (click)="declineRequest(request.id)"
                        class="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <!-- Empty State -->
          <div *ngIf="filteredRequests.length === 0" class="text-center py-12">
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
            <h3 class="mt-2 text-sm font-medium text-gray-900">No requests</h3>
            <p class="mt-1 text-sm text-gray-500">
              {{
                filter === 'pending'
                  ? 'No pending requests'
                  : filter === 'accepted'
                  ? 'No accepted requests'
                  : 'No declined requests'
              }}
            </p>
          </div>
        </div>

        <!-- Request Details Modal -->
        <div
          *ngIf="selectedRequest"
          class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        >
          <div
            class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
          >
            <div class="mt-3">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                Request Details
              </h3>
              <div class="space-y-4">
                <div>
                  <strong>Trip Route:</strong>
                  {{ selectedRequest.trip.departure }} →
                  {{ selectedRequest.trip.arrival }}
                </div>
                <div>
                  <strong>Parcel Type:</strong>
                  {{ selectedRequest.trip.parcelType }}
                </div>
                <div>
                  <strong>Sender:</strong>
                  {{ selectedRequest.sender.firstName }}
                  {{ selectedRequest.sender.lastName }}
                </div>
                <div>
                  <strong>Email:</strong> {{ selectedRequest.sender.email }}
                </div>
                <div>
                  <strong>Status:</strong>
                  <span
                    [class]="getStatusClass(selectedRequest.status)"
                    class="ml-2 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ selectedRequest.status }}
                  </span>
                </div>

                <!-- Parcels Details -->
                <div *ngIf="selectedRequest.trip.parcels?.length">
                  <strong>Parcels:</strong>
                  <div class="mt-2 space-y-2">
                    <div
                      *ngFor="let parcel of selectedRequest.trip.parcels"
                      class="bg-gray-50 p-3 rounded"
                    >
                      <div class="grid grid-cols-2 gap-2 text-sm">
                        <div><strong>Type:</strong> {{ parcel.type }}</div>
                        <div>
                          <strong>Weight:</strong> {{ parcel.weight }}kg
                        </div>
                        <div>
                          <strong>Dimensions:</strong> {{ parcel.width }}x{{
                            parcel.height
                          }}cm
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-6 flex justify-end">
                <button
                  (click)="selectedRequest = null"
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
export class DriverRequestsComponent implements OnInit {
  allRequests: TripRequest[] = [];
  pendingRequests: TripRequest[] = [];
  acceptedRequests: TripRequest[] = [];
  declinedRequests: TripRequest[] = [];
  filteredRequests: TripRequest[] = [];
  selectedRequest: TripRequest | null = null;
  filter = 'pending';
  username: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.username = this.authService.getUsername();
    this.loadRequests();
  }

  logout() {
    this.authService.logout();
  }

  goToDashboard() {
    this.router.navigate(['/driver']);
  }

  loadRequests() {
    this.http
      .get<TripRequest[]>('http://localhost:8080/api/driver/requests')
      .subscribe({
        next: (requests) => {
          this.allRequests = requests;
          this.categorizeRequests();
          this.setFilter(this.filter);
        },
        error: (error) => {
          console.error('Error loading requests:', error);
        },
      });
  }

  categorizeRequests() {
    this.pendingRequests = this.allRequests.filter(
      (req) => req.status === 'PENDING'
    );
    this.acceptedRequests = this.allRequests.filter(
      (req) => req.status === 'ACCEPTED'
    );
    this.declinedRequests = this.allRequests.filter(
      (req) => req.status === 'DECLINED'
    );
  }

  setFilter(filter: string) {
    this.filter = filter;
    switch (filter) {
      case 'pending':
        this.filteredRequests = this.pendingRequests;
        break;
      case 'accepted':
        this.filteredRequests = this.acceptedRequests;
        break;
      case 'declined':
        this.filteredRequests = this.declinedRequests;
        break;
      default:
        this.filteredRequests = this.pendingRequests;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'DECLINED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  viewRequestDetails(request: TripRequest) {
    this.selectedRequest = request;
  }

  acceptRequest(requestId: string) {
    this.http
      .put(`http://localhost:8080/api/driver/requests/${requestId}/accept`, {})
      .subscribe({
        next: () => {
          this.loadRequests(); // Reload to update status
        },
        error: (error) => {
          console.error('Error accepting request:', error);
        },
      });
  }

  declineRequest(requestId: string) {
    this.http
      .put(`http://localhost:8080/api/driver/requests/${requestId}/decline`, {})
      .subscribe({
        next: () => {
          this.loadRequests(); // Reload to update status
        },
        error: (error) => {
          console.error('Error declining request:', error);
        },
      });
  }
}
