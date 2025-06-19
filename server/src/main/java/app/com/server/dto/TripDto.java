package app.com.server.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TripDto {
    private UUID id;
    private String departure;
    private String arrival;
    private String parcelType;
    private UUID driverId;
    // Optionally, you can add List<UUID> for parcels, tripRequests, tripStops if needed
}