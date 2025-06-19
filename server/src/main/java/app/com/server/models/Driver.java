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
public class Driver extends User {
    @OneToMany(mappedBy = "driver")
    private List<Trip> trips;

    // Additional fields or methods for Driver can be added here
} 