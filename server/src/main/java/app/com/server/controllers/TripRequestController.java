package app.com.server.controllers;

import app.com.server.dto.TripRequestDto;
import app.com.server.models.TripRequest;
import app.com.server.services.TripRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/trip-requests")
public class TripRequestController {
    private final TripRequestService tripRequestService;

    public TripRequestController(TripRequestService tripRequestService) {
        this.tripRequestService = tripRequestService;
    }

    @GetMapping
    public List<TripRequestDto> getAll() {
        return tripRequestService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TripRequestDto> getById(@PathVariable UUID id) {
        return tripRequestService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public TripRequestDto create(@RequestBody TripRequest tripRequest) {
        return tripRequestService.save(tripRequest);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TripRequestDto> update(@PathVariable UUID id, @RequestBody TripRequest tripRequest) {
        if (!tripRequestService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        tripRequest.setId(id);
        return ResponseEntity.ok(tripRequestService.save(tripRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!tripRequestService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        tripRequestService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
} 