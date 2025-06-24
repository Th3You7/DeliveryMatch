package app.com.server.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.com.server.dto.LoginRequestDto;
import app.com.server.dto.LoginResponseDto;
import app.com.server.dto.RegisterRequestDto;
import app.com.server.enums.UserType;
import app.com.server.models.Driver;
import app.com.server.models.Sender;
import app.com.server.models.User;
import app.com.server.repositories.UserRepository;
import app.com.server.services.UserService;
import app.com.server.utils.JwtUtil;

@RestController
@RequestMapping("/api")
public class AuthController {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    @Autowired
    public AuthController(UserService userService, JwtUtil jwtUtil, AuthenticationManager authenticationManager, UserRepository userRepository) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.username, loginRequest.password)
            );
            UserDetails user = (UserDetails) authentication.getPrincipal();

            String token = jwtUtil.generateToken(user.getUsername());
            
            // Extract all authorities
            List<String> authorities = user.getAuthorities().stream()
                    .map(authority -> authority.getAuthority())
                    .collect(Collectors.toList());
            
            LoginResponseDto response = new LoginResponseDto(token, user.getUsername(), authorities);
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDto registerRequest) {
        // Check if username already exists
        if (userRepository.findByUsername(registerRequest.username) != null) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Username already exists");
            return ResponseEntity.status(409).body(errorResponse);
        }

        // Check if email already exists
        if (userRepository.findByEmail(registerRequest.email) != null) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Email already exists");
            return ResponseEntity.status(409).body(errorResponse);
        }

        User user;
        
        // Create appropriate user type based on userType
        if (registerRequest.userType == UserType.DRIVER) {
            Driver driver = new Driver();
            driver.setUsername(registerRequest.username);
            driver.setPassword(registerRequest.password);
            driver.setEmail(registerRequest.email);
            driver.setFirstName(registerRequest.firstName);
            driver.setLastName(registerRequest.lastName);
            driver.setUserType(UserType.DRIVER);
            user = driver;
        } else if (registerRequest.userType == UserType.SENDER) {
            Sender sender = new Sender();
            sender.setUsername(registerRequest.username);
            sender.setPassword(registerRequest.password);
            sender.setEmail(registerRequest.email);
            sender.setFirstName(registerRequest.firstName);
            sender.setLastName(registerRequest.lastName);
            sender.setUserType(UserType.SENDER);
            user = sender;
        } else {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Invalid user type");
            return ResponseEntity.status(400).body(errorResponse);
        }
        
        User savedUser = userService.register(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully");
        response.put("userId", savedUser.getId());
        response.put("username", savedUser.getUsername());
        response.put("userType", "ROLE_" + savedUser.getUserType().name());
        
        return ResponseEntity.ok(response);
    }
} 