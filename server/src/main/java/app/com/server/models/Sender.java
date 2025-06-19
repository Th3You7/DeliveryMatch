package app.com.server.models;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Sender extends User {
    @OneToMany(mappedBy = "sender")
    private List<TripRequest> tripRequests;

    // Additional fields or methods for Sender can be added here
} 