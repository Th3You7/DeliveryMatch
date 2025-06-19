package app.com.server.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import app.com.server.dto.TripRequestDto;
import app.com.server.models.TripRequest;

@Mapper(componentModel = "spring")
public interface TripRequestMapper {
    @Mapping(target = "tripId", source = "trip.id")
    @Mapping(target = "senderId", source = "sender.id")
    @Mapping(target = "status", source = "status", qualifiedByName = "statusToString")
    TripRequestDto toDto(TripRequest tripRequest);

    @Mapping(target = "trip.id", source = "tripId")
    @Mapping(target = "sender.id", source = "senderId")
    @Mapping(target = "status", source = "status", qualifiedByName = "stringToStatus")
    TripRequest toEntity(TripRequestDto tripRequestDto);

    @Named("statusToString")
    default String statusToString(Enum<?> status) {
        return status != null ? status.name() : null;
    }

    @Named("stringToStatus")
    default app.com.server.enums.TripRequestStatus stringToStatus(String status) {
        return status != null ? app.com.server.enums.TripRequestStatus.valueOf(status) : null;
    }
} 