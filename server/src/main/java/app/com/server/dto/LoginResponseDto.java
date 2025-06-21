package app.com.server.dto;

import java.util.List;

public class LoginResponseDto {
    public String token;
    public String username;
    public List<String> roles;

    public LoginResponseDto(String token, String username, List<String> roles) {
        this.token = token;
        this.username = username;
        this.roles = roles;
    }
} 