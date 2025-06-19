package app.com.server.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import app.com.server.dto.TripStopsDto;
import app.com.server.models.TripStops;

@Mapper(componentModel = "spring")
public interface TripStopsMapper {
    @Mapping(target = "tripId", source = "trip.id")
    TripStopsDto toDto(TripStops tripStops);

    @Mapping(target = "trip.id", source = "tripId")
    TripStops toEntity(TripStopsDto tripStopsDto);
} 