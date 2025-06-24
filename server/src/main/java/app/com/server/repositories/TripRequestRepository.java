package app.com.server.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import app.com.server.enums.TripRequestStatus;
import app.com.server.models.Driver;
import app.com.server.models.TripRequest;

public interface TripRequestRepository extends JpaRepository<TripRequest, UUID> {
    List<TripRequest> findByTripDriver(Driver driver);
    List<TripRequest> findByTripDriverAndStatus(Driver driver, TripRequestStatus status);
} 