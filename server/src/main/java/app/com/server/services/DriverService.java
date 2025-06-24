package app.com.server.services;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.com.server.dto.TripDto;
import app.com.server.dto.TripRequestDto;
import app.com.server.enums.ParcelType;
import app.com.server.enums.TripRequestStatus;
import app.com.server.mapper.TripMapper;
import app.com.server.mapper.TripRequestMapper;
import app.com.server.models.Driver;
import app.com.server.models.Trip;
import app.com.server.models.TripRequest;
import app.com.server.models.User;
import app.com.server.repositories.DriverRepository;
import app.com.server.repositories.TripRepository;
import app.com.server.repositories.TripRequestRepository;
import app.com.server.repositories.TripStopsRepository;
import app.com.server.repositories.UserRepository;

@Service
public class DriverService {
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;
    private final TripRequestRepository tripRequestRepository;
    private final TripStopsRepository tripStopsRepository;
    private final UserRepository userRepository;
    private final TripMapper tripMapper;
    private final TripRequestMapper tripRequestMapper;

    @Autowired
    public DriverService(
            DriverRepository driverRepository,
            TripRepository tripRepository,
            TripRequestRepository tripRequestRepository,
            TripStopsRepository tripStopsRepository,
            UserRepository userRepository,
            TripMapper tripMapper,
            TripRequestMapper tripRequestMapper) {
        this.driverRepository = driverRepository;
        this.tripRepository = tripRepository;
        this.tripRequestRepository = tripRequestRepository;
        this.tripStopsRepository = tripStopsRepository;
        this.userRepository = userRepository;
        this.tripMapper = tripMapper;
        this.tripRequestMapper = tripRequestMapper;
    }

    public List<TripDto> getDriverTrips(String driverUsername) {
        User user = userRepository.findByUsername(driverUsername);
        if (user == null || !(user instanceof Driver)) {
            throw new RuntimeException("Driver not found");
        }
        Driver driver = (Driver) user;
        
        List<Trip> trips = tripRepository.findByDriver(driver);
        return trips.stream()
                .map(tripMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<TripDto> getActiveTrips(String driverUsername) {
        User user = userRepository.findByUsername(driverUsername);
        if (user == null || !(user instanceof Driver)) {
            throw new RuntimeException("Driver not found");
        }
        Driver driver = (Driver) user;
        
        List<Trip> trips = tripRepository.findByDriverAndStatus(driver, "ACTIVE");
        return trips.stream()
                .map(tripMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<TripDto> getCompletedTrips(String driverUsername) {
        User user = userRepository.findByUsername(driverUsername);
        if (user == null || !(user instanceof Driver)) {
            throw new RuntimeException("Driver not found");
        }
        Driver driver = (Driver) user;
        
        List<Trip> trips = tripRepository.findByDriverAndStatus(driver, "COMPLETED");
        return trips.stream()
                .map(tripMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<TripDto> getTripHistory(String driverUsername) {
        User user = userRepository.findByUsername(driverUsername);
        if (user == null || !(user instanceof Driver)) {
            throw new RuntimeException("Driver not found");
        }
        Driver driver = (Driver) user;
        
        List<Trip> trips = tripRepository.findByDriverAndStatus(driver, "COMPLETED");
        return trips.stream()
                .map(tripMapper::toDto)
                .collect(Collectors.toList());
    }

    public TripDto createTrip(String driverUsername, TripDto tripDto) {
        User user = userRepository.findByUsername(driverUsername);
        if (user == null || !(user instanceof Driver)) {
            throw new RuntimeException("Driver not found");
        }
        Driver driver = (Driver) user;
        
        Trip trip = tripMapper.toEntity(tripDto);
        trip.setDriver(driver);
        trip.setStatus("ACTIVE");
        
        // Set the trip reference for each trip stop
        if (trip.getTripStops() != null) {
            trip.getTripStops().forEach(stop -> stop.setTrip(trip));
        }
        
        Trip savedTrip = tripRepository.save(trip);
        return tripMapper.toDto(savedTrip);
    }

    public TripDto updateTrip(String driverUsername, String tripId, TripDto tripDto) {
        User user = userRepository.findByUsername(driverUsername);
        if (user == null || !(user instanceof Driver)) {
            throw new RuntimeException("Driver not found");
        }
        Driver driver = (Driver) user;
        
        Trip existingTrip = tripRepository.findById(UUID.fromString(tripId))
                .orElseThrow(() -> new RuntimeException("Trip not found"));
        
        if (!existingTrip.getDriver().getId().equals(driver.getId())) {
            throw new RuntimeException("Unauthorized to update this trip");
        }
        
        existingTrip.setDeparture(tripDto.getDeparture());
        existingTrip.setArrival(tripDto.getArrival());
        existingTrip.setParcelType(ParcelType.valueOf(tripDto.getParcelType()));
        
        Trip updatedTrip = tripRepository.save(existingTrip);
        return tripMapper.toDto(updatedTrip);
    }

    public void deleteTrip(String driverUsername, String tripId) {
        User user = userRepository.findByUsername(driverUsername);
        if (user == null || !(user instanceof Driver)) {
            throw new RuntimeException("Driver not found");
        }
        Driver driver = (Driver) user;
        
        Trip trip = tripRepository.findById(UUID.fromString(tripId))
                .orElseThrow(() -> new RuntimeException("Trip not found"));
        
        if (!trip.getDriver().getId().equals(driver.getId())) {
            throw new RuntimeException("Unauthorized to delete this trip");
        }
        
        tripRepository.delete(trip);
    }

    public List<TripRequestDto> getTripRequests(String driverUsername) {
        User user = userRepository.findByUsername(driverUsername);
        if (user == null || !(user instanceof Driver)) {
            throw new RuntimeException("Driver not found");
        }
        Driver driver = (Driver) user;
        
        List<TripRequest> requests = tripRequestRepository.findByTripDriver(driver);
        return requests.stream()
                .map(tripRequestMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<TripRequestDto> getPendingRequests(String driverUsername) {
        User user = userRepository.findByUsername(driverUsername);
        if (user == null || !(user instanceof Driver)) {
            throw new RuntimeException("Driver not found");
        }
        Driver driver = (Driver) user;
        
        List<TripRequest> requests = tripRequestRepository.findByTripDriverAndStatus(driver, TripRequestStatus.PENDING);
        return requests.stream()
                .map(tripRequestMapper::toDto)
                .collect(Collectors.toList());
    }

    public void acceptRequest(String driverUsername, String requestId) {
        User user = userRepository.findByUsername(driverUsername);
        if (user == null || !(user instanceof Driver)) {
            throw new RuntimeException("Driver not found");
        }
        Driver driver = (Driver) user;
        
        TripRequest request = tripRequestRepository.findById(UUID.fromString(requestId))
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        if (!request.getTrip().getDriver().getId().equals(driver.getId())) {
            throw new RuntimeException("Unauthorized to accept this request");
        }
        
        request.setStatus(TripRequestStatus.ACCEPTED);
        tripRequestRepository.save(request);
    }

    public void declineRequest(String driverUsername, String requestId) {
        User user = userRepository.findByUsername(driverUsername);
        if (user == null || !(user instanceof Driver)) {
            throw new RuntimeException("Driver not found");
        }
        Driver driver = (Driver) user;
        
        TripRequest request = tripRequestRepository.findById(UUID.fromString(requestId))
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        if (!request.getTrip().getDriver().getId().equals(driver.getId())) {
            throw new RuntimeException("Unauthorized to decline this request");
        }
        
        request.setStatus(TripRequestStatus.REJECTED);
        tripRequestRepository.save(request);
    }
} 