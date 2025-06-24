package app.com.server.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import app.com.server.models.Driver;
import app.com.server.models.Trip;

public interface TripRepository extends JpaRepository<Trip, UUID> {
    List<Trip> findByDriverId(UUID driverId);
    List<Trip> findByDriver(Driver driver);
    List<Trip> findByDriverAndStatus(Driver driver, String status);
} 