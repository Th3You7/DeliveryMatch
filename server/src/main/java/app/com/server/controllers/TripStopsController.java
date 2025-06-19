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

import app.com.server.dto.TripStopsDto;
import app.com.server.models.TripStops;
import app.com.server.services.TripStopsService;

@RestController
@RequestMapping("/api/trip-stops")
public class TripStopsController {
    private final TripStopsService tripStopsService;

    public TripStopsController(TripStopsService tripStopsService) {
        this.tripStopsService = tripStopsService;
    }

    @GetMapping
    public List<TripStopsDto> getAll() {
        return tripStopsService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TripStopsDto> getById(@PathVariable UUID id) {
        return tripStopsService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public TripStopsDto create(@RequestBody TripStops tripStops) {
        return tripStopsService.save(tripStops);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TripStopsDto> update(@PathVariable UUID id, @RequestBody TripStops tripStops) {
        if (!tripStopsService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        tripStops.setId(id);
        return ResponseEntity.ok(tripStopsService.save(tripStops));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!tripStopsService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        tripStopsService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/trip/{tripId}")
    public List<TripStopsDto> getByTripId(@PathVariable UUID tripId) {
        return tripStopsService.findByTripId(tripId);
    }
} 