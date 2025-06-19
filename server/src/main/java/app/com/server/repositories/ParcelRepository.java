package app.com.server.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import app.com.server.models.Parcel;

public interface ParcelRepository extends JpaRepository<Parcel, UUID> {
} 