package app.com.server.models;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Sender extends User {
    @OneToMany(mappedBy = "sender")
    private List<TripRequest> tripRequests;

    // Additional fields or methods for Sender can be added here
} 