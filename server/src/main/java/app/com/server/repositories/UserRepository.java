package app.com.server.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import app.com.server.models.User;

public interface UserRepository extends JpaRepository<User, java.util.UUID> {
    User findByUsername(String username);
    User findByEmail(String email);
} 