package app.com.server.dto;

import app.com.server.enums.UserType;

public class RegisterRequestDto {
    public String username;
    public String password;
    public String email;
    public String firstName;
    public String lastName;
    public UserType userType;
} 