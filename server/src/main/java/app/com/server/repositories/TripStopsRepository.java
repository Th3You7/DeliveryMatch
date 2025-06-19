package app.com.server.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import app.com.server.models.TripStops;

public interface TripStopsRepository extends JpaRepository<TripStops, UUID> {
    List<TripStops> findByTripId(UUID tripId);
} 