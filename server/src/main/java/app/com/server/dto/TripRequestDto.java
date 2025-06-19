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
public class TripRequestDto {
    private UUID id;
    private String status;
    private UUID tripId;
    private UUID senderId;
    // Optionally, you can add List<UUID> for parcels if needed
}
