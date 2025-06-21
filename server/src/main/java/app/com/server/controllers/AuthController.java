package app.com.server.controllers;

import app.com.server.models.User;
import app.com.server.services.UserService;
import app.com.server.utils.JwtUtil;
import app.com.server.dto.LoginRequestDto;
import app.com.server.dto.RegisterRequestDto;
import app.com.server.dto.LoginResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;

@RestController
@RequestMapping("/api")
public class AuthController {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthController(UserService userService, JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.username, loginRequest.password)
            );
            UserDetails user = (UserDetails) authentication.getPrincipal();

            String token = jwtUtil.generateToken(user.getUsername());
            LoginResponseDto response = new LoginResponseDto(token, user.getUsername(), Collections.singletonList("USER"));
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDto registerRequest) {
        User user = new User();
        user.setUsername(registerRequest.username);
        user.setPassword(registerRequest.password);
        user.setEmail(registerRequest.email);
        user.setFirstName(registerRequest.firstName);
        user.setLastName(registerRequest.lastName);
        userService.register(user);
        return ResponseEntity.ok("User registered");
    }
} 