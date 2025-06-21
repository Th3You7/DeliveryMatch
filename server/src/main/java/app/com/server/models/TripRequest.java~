package app.com.server.models;

import java.util.List;
import java.util.UUID;

import app.com.server.enums.TripRequestStatus;
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
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TripRequest {
    @Id
    @GeneratedValue
    private UUID id;
    @Enumerated(EnumType.STRING)
    private TripRequestStatus status = TripRequestStatus.PENDING;
    @ManyToOne
    @JoinColumn(name = "trip_id")
    private Trip trip;
    @OneToMany(mappedBy = "tripRequest")
    private List<Parcel> parcels;
    @ManyToOne
    @JoinColumn(name = "sender_id")
    private Sender sender;
    // Getters and setters
} 