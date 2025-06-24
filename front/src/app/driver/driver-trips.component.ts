import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface Trip {
  id: string;
  departure: string;
  arrival: string;
  parcelType: string;
  status: string;
  driver: any;
  parcels: Parcel[];
  tripRequests: any[];
  tripStops: TripStop[];
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

interface TripStop {
  id?: string;
  stop: string;
  tripId?: string;
}

interface TripForm {
  departure: string;
  arrival: string;
  parcelType: string;
  tripStops: TripStop[];
}

@Component({
  selector: 'app-driver-trips',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">My Trips</h1>
            <p class="mt-2 text-gray-600">Welcome, {{ username }}</p>
          </div>
          <div class="flex space-x-4">
            <button
              (click)="showCreateForm = true"
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create New Trip
            </button>
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

        <!-- Create Trip Form -->
        <div *ngIf="showCreateForm" class="bg-white p-6 rounded-lg shadow mb-8">
          <h2 class="text-xl font-semibold mb-4">Create New Trip</h2>
          <form
            [formGroup]="tripForm"
            (ngSubmit)="createTrip()"
            class="space-y-4"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Departure</label
                >
                <input
                  type="text"
                  formControlName="departure"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter departure location"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Arrival</label
                >
                <input
                  type="text"
                  formControlName="arrival"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter arrival location"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Parcel Type</label
              >
              <select
                formControlName="parcelType"
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select parcel type</option>
                <option value="DOCUMENT">Document</option>
                <option value="BOX">Box</option>
                <option value="ENVELOPE">Envelope</option>
                <option value="PALLET">Pallet</option>
                <option value="CRATE">Crate</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <!-- Trip Stops Section -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Trip Stops</label
              >
              <div class="space-y-2">
                <div
                  *ngFor="
                    let stop of tripForm.get('tripStops')?.value;
                    let i = index
                  "
                  class="flex space-x-2"
                >
                  <input
                    type="text"
                    [value]="stop.stop"
                    (input)="updateTripStop(i, $event)"
                    class="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter stop location"
                  />
                  <button
                    type="button"
                    (click)="removeTripStop(i)"
                    class="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
                <button
                  type="button"
                  (click)="addTripStop()"
                  class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Add Stop
                </button>
              </div>
            </div>

            <div class="flex space-x-4">
              <button
                type="submit"
                [disabled]="tripForm.invalid || isCreating"
                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {{ isCreating ? 'Creating...' : 'Create Trip' }}
              </button>
              <button
                type="button"
                (click)="cancelCreate()"
                class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <!-- Trips List -->
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul class="divide-y divide-gray-200">
            <li *ngFor="let trip of trips" class="px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-lg font-medium text-gray-900">
                        {{ trip.departure }} → {{ trip.arrival }}
                      </h3>
                      <p class="text-sm text-gray-500">
                        Parcel Type: {{ trip.parcelType }}
                      </p>
                      <p class="text-sm text-gray-500">
                        Parcels: {{ trip.parcels?.length || 0 }} | Requests:
                        {{ trip.tripRequests?.length || 0 }}
                      </p>
                    </div>
                    <div class="flex space-x-2">
                      <button
                        (click)="viewTripDetails(trip)"
                        class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                      <button
                        (click)="editTrip(trip)"
                        class="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        (click)="deleteTrip(trip.id)"
                        class="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Trip Details Modal -->
        <div
          *ngIf="selectedTrip"
          class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        >
          <div
            class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
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
                <div>
                  <strong>Parcels:</strong>
                  {{ selectedTrip.parcels?.length || 0 }}
                </div>
                <div>
                  <strong>Trip Requests:</strong>
                  {{ selectedTrip.tripRequests?.length || 0 }}
                </div>
                <div>
                  <strong>Trip Stops:</strong>
                  {{ selectedTrip.tripStops?.length || 0 }}
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
export class DriverTripsComponent implements OnInit {
  trips: Trip[] = [];
  selectedTrip: Trip | null = null;
  showCreateForm = false;
  isCreating = false;
  tripForm: FormGroup;
  username: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.tripForm = this.fb.group({
      departure: ['', Validators.required],
      arrival: ['', Validators.required],
      parcelType: ['', Validators.required],
      tripStops: [[]],
    });
  }

  ngOnInit() {
    this.username = this.authService.getUsername();
    this.loadTrips();
  }

  logout() {
    this.authService.logout();
  }

  goToDashboard() {
    this.router.navigate(['/driver']);
  }

  loadTrips() {
    this.http.get<Trip[]>('http://localhost:8080/api/driver/trips').subscribe({
      next: (trips) => {
        this.trips = trips;
      },
      error: (error) => {
        console.error('Error loading trips:', error);
      },
    });
  }

  createTrip() {
    if (this.tripForm.valid) {
      this.isCreating = true;
      const tripData: TripForm = this.tripForm.value;

      this.http
        .post<Trip>('http://localhost:8080/api/driver/trips', tripData)
        .subscribe({
          next: (trip) => {
            this.trips.unshift(trip);
            this.cancelCreate();
            this.isCreating = false;
          },
          error: (error) => {
            console.error('Error creating trip:', error);
            this.isCreating = false;
          },
        });
    }
  }

  cancelCreate() {
    this.showCreateForm = false;
    this.tripForm.reset();
  }

  viewTripDetails(trip: Trip) {
    this.selectedTrip = trip;
  }

  editTrip(trip: Trip) {
    // TODO: Implement edit functionality
    console.log('Edit trip:', trip);
  }

  deleteTrip(tripId: string) {
    if (confirm('Are you sure you want to delete this trip?')) {
      this.http
        .delete(`http://localhost:8080/api/driver/trips/${tripId}`)
        .subscribe({
          next: () => {
            this.trips = this.trips.filter((trip) => trip.id !== tripId);
          },
          error: (error) => {
            console.error('Error deleting trip:', error);
          },
        });
    }
  }

  addTripStop() {
    const currentStops = this.tripForm.get('tripStops')?.value || [];
    currentStops.push({ stop: '' });
    this.tripForm.patchValue({ tripStops: currentStops });
  }

  removeTripStop(index: number) {
    const currentStops = this.tripForm.get('tripStops')?.value || [];
    currentStops.splice(index, 1);
    this.tripForm.patchValue({ tripStops: currentStops });
  }

  updateTripStop(index: number, event: any) {
    const currentStops = this.tripForm.get('tripStops')?.value || [];
    currentStops[index].stop = event.target.value;
    this.tripForm.patchValue({ tripStops: currentStops });
  }
}
