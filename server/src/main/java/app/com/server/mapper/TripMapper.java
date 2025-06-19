package app.com.server.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import app.com.server.dto.TripDto;
import app.com.server.models.Trip;

@Mapper(componentModel = "spring")
public interface TripMapper {
    @Mapping(target = "driverId", source = "driver.id")
    @Mapping(target = "parcelType", source = "parcelType", qualifiedByName = "parcelTypeToString")
    TripDto toDto(Trip trip);

    @Mapping(target = "driver.id", source = "driverId")
    @Mapping(target = "parcelType", source = "parcelType", qualifiedByName = "stringToParcelType")
    Trip toEntity(TripDto tripDto);

    @Named("parcelTypeToString")
    default String parcelTypeToString(Enum<?> parcelType) {
        return parcelType != null ? parcelType.name() : null;
    }

    @Named("stringToParcelType")
    default app.com.server.enums.ParcelType stringToParcelType(String type) {
        return type != null ? app.com.server.enums.ParcelType.valueOf(type) : null;
    }
} 