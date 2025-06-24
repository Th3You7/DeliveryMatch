package app.com.server.repositories;

import app.com.server.models.Driver;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DriverRepository extends JpaRepository<Driver, java.util.UUID> {
    Driver findByUsername(String username);
} 