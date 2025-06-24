package app.com.server.models;

import java.util.List;
import java.util.UUID;

import app.com.server.enums.ParcelType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
public class Trip {
    @Id
    @GeneratedValue
    private UUID id;
    private String departure;
    private String arrival;
    @Enumerated(EnumType.STRING)
    private ParcelType parcelType;
    private String status = "ACTIVE"; // ACTIVE, COMPLETED, CANCELLED
    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Parcel> parcels;
    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TripRequest> tripRequests;
    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TripStops> tripStops;
    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;
} 