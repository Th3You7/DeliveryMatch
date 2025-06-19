package app.com.server.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import app.com.server.dto.UserDto;
import app.com.server.models.Admin;
import app.com.server.models.Driver;
import app.com.server.models.Sender;
import app.com.server.models.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    @Mapping(target = "role", source = "user", qualifiedByName = "userRole")
    UserDto tDto(User user);

    @Named("userRole")
    public static String userRole(User user) {
        if (user instanceof Admin) return "ADMIN";
        if (user instanceof Driver) return "DRIVER";
        if (user instanceof Sender) return "SENDER";
        return "ADMIN";
    }
} 