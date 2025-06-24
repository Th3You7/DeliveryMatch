package app.com.server.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import app.com.server.dto.TripDto;
import app.com.server.models.Trip;

@Mapper(componentModel = "spring", uses = {TripStopsMapper.class, ParcelMapper.class})
public interface TripMapper {
    @Mapping(target = "driverId", source = "driver.id")
    @Mapping(target = "parcelType", source = "parcelType", qualifiedByName = "parcelTypeToString")
    @Mapping(target = "tripStops", source = "tripStops")
    @Mapping(target = "parcels", source = "parcels")
    @Mapping(target = "tripRequestIds", source = "tripRequests", qualifiedByName = "tripRequestsToIds")
    TripDto toDto(Trip trip);

    @Mapping(target = "driver.id", source = "driverId")
    @Mapping(target = "parcelType", source = "parcelType", qualifiedByName = "stringToParcelType")
    @Mapping(target = "tripStops", source = "tripStops")
    @Mapping(target = "parcels", source = "parcels")
    @Mapping(target = "tripRequests", ignore = true)
    Trip toEntity(TripDto tripDto);

    @Named("parcelTypeToString")
    default String parcelTypeToString(Enum<?> parcelType) {
        return parcelType != null ? parcelType.name() : null;
    }

    @Named("stringToParcelType")
    default app.com.server.enums.ParcelType stringToParcelType(String type) {
        return type != null ? app.com.server.enums.ParcelType.valueOf(type) : null;
    }

    @Named("tripRequestsToIds")
    default List<java.util.UUID> tripRequestsToIds(List<?> tripRequests) {
        if (tripRequests == null) return null;
        return tripRequests.stream()
            .map(request -> {
                try {
                    return (java.util.UUID) request.getClass().getMethod("getId").invoke(request);
                } catch (Exception e) {
                    return null;
                }
            })
            .filter(id -> id != null)
            .collect(Collectors.toList());
    }
} 