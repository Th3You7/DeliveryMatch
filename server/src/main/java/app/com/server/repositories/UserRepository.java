package app.com.server.repositories;

import app.com.server.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, java.util.UUID> {
    User findByUsername(String username);
} 