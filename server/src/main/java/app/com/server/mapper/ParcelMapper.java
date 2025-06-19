package app.com.server.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import app.com.server.dto.ParcelDto;
import app.com.server.models.Parcel;

@Mapper(componentModel = "spring")
public interface ParcelMapper {
    @Mapping(target = "tripId", source = "trip.id")
    @Mapping(target = "tripRequestId", source = "tripRequest.id")
    @Mapping(target = "type", source = "type", qualifiedByName = "typeToString")
    ParcelDto toDto(Parcel parcel);

    @Mapping(target = "trip.id", source = "tripId")
    @Mapping(target = "tripRequest.id", source = "tripRequestId")
    @Mapping(target = "type", source = "type", qualifiedByName = "stringToType")
    Parcel toEntity(ParcelDto parcelDto);

    @Named("typeToString")
    default String typeToString(Enum<?> type) {
        return type != null ? type.name() : null;
    }

    @Named("stringToType")
    default app.com.server.enums.ParcelType stringToType(String type) {
        return type != null ? app.com.server.enums.ParcelType.valueOf(type) : null;
    }
} 