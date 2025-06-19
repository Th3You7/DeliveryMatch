package app.com.server.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.com.server.dto.TripDto;
import app.com.server.models.Trip;
import app.com.server.services.TripService;

@RestController
@RequestMapping("/api/trips")
public class TripController {
    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping
    public List<TripDto> getAll() {
        return tripService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TripDto> getById(@PathVariable UUID id) {
        return tripService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public TripDto create(@RequestBody Trip trip) {
        return tripService.save(trip);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TripDto> update(@PathVariable UUID id, @RequestBody Trip trip) {
        if (!tripService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        trip.setId(id);
        return ResponseEntity.ok(tripService.save(trip));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!tripService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        tripService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/driver/{driverId}")
    public List<TripDto> getByDriverId(@PathVariable UUID driverId) {
        return tripService.findByDriverId(driverId);
    }
} 