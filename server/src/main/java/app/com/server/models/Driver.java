package app.com.server.models;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Driver extends User {
    @OneToMany(mappedBy = "driver")
    private List<Trip> trips;

    // Additional fields or methods for Driver can be added here
} 