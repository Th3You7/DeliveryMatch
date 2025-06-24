package app.com.server.controllers;

import app.com.server.models.Trip;
import app.com.server.models.TripRequest;
import app.com.server.services.DriverService;
import app.com.server.dto.TripDto;
import app.com.server.dto.TripRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/driver")
public class DriverController {
    private final DriverService driverService;

    @Autowired
    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    // Trip CRUD operations
    @GetMapping("/trips")
    public ResponseEntity<List<TripDto>> getDriverTrips() {
        String driverUsername = getCurrentDriverUsername();
        List<TripDto> trips = driverService.getDriverTrips(driverUsername);
        return ResponseEntity.ok(trips);
    }

    @GetMapping("/trips/active")
    public ResponseEntity<List<TripDto>> getActiveTrips() {
        String driverUsername = getCurrentDriverUsername();
        List<TripDto> trips = driverService.getActiveTrips(driverUsername);
        return ResponseEntity.ok(trips);
    }

    @GetMapping("/trips/completed")
    public ResponseEntity<List<TripDto>> getCompletedTrips() {
        String driverUsername = getCurrentDriverUsername();
        List<TripDto> trips = driverService.getCompletedTrips(driverUsername);
        return ResponseEntity.ok(trips);
    }

    @GetMapping("/trips/history")
    public ResponseEntity<List<TripDto>> getTripHistory() {
        String driverUsername = getCurrentDriverUsername();
        List<TripDto> trips = driverService.getTripHistory(driverUsername);
        return ResponseEntity.ok(trips);
    }

    @PostMapping("/trips")
    public ResponseEntity<TripDto> createTrip(@RequestBody TripDto tripDto) {
        String driverUsername = getCurrentDriverUsername();
        TripDto createdTrip = driverService.createTrip(driverUsername, tripDto);
        return ResponseEntity.ok(createdTrip);
    }

    @PutMapping("/trips/{tripId}")
    public ResponseEntity<TripDto> updateTrip(@PathVariable String tripId, @RequestBody TripDto tripDto) {
        String driverUsername = getCurrentDriverUsername();
        TripDto updatedTrip = driverService.updateTrip(driverUsername, tripId, tripDto);
        return ResponseEntity.ok(updatedTrip);
    }

    @DeleteMapping("/trips/{tripId}")
    public ResponseEntity<Map<String, String>> deleteTrip(@PathVariable String tripId) {
        String driverUsername = getCurrentDriverUsername();
        driverService.deleteTrip(driverUsername, tripId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Trip deleted successfully");
        return ResponseEntity.ok(response);
    }

    // Trip Request operations
    @GetMapping("/requests")
    public ResponseEntity<List<TripRequestDto>> getTripRequests() {
        String driverUsername = getCurrentDriverUsername();
        List<TripRequestDto> requests = driverService.getTripRequests(driverUsername);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/requests/pending")
    public ResponseEntity<List<TripRequestDto>> getPendingRequests() {
        String driverUsername = getCurrentDriverUsername();
        List<TripRequestDto> requests = driverService.getPendingRequests(driverUsername);
        return ResponseEntity.ok(requests);
    }

    @PutMapping("/requests/{requestId}/accept")
    public ResponseEntity<Map<String, String>> acceptRequest(@PathVariable String requestId) {
        String driverUsername = getCurrentDriverUsername();
        driverService.acceptRequest(driverUsername, requestId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Request accepted successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/requests/{requestId}/decline")
    public ResponseEntity<Map<String, String>> declineRequest(@PathVariable String requestId) {
        String driverUsername = getCurrentDriverUsername();
        driverService.declineRequest(driverUsername, requestId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Request declined successfully");
        return ResponseEntity.ok(response);
    }

    private String getCurrentDriverUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
} 