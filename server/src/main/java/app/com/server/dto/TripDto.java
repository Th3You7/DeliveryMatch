package app.com.server.dto;

import java.util.List;
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
    private String status;
    private UUID driverId;
    private List<TripStopsDto> tripStops;
    private List<ParcelDto> parcels;
    private List<UUID> tripRequestIds;
}