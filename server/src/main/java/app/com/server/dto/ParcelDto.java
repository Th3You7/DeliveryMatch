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
public class ParcelDto {
    private UUID id;
    private double width;
    private double height;
    private double weight;
    private int quantity;
    private String type;
    private UUID tripId;
    private UUID tripRequestId;
}