package app.com.server.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import app.com.server.models.TripRequest;

public interface TripRequestRepository extends JpaRepository<TripRequest, UUID> {
} 