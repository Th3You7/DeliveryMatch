package app.com.server.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.com.server.dto.TripDto;
import app.com.server.mapper.TripMapper;
import app.com.server.models.Trip;
import app.com.server.repositories.TripRepository;

@Service
public class TripService {
    private final TripRepository tripRepository;
    private final TripMapper tripMapper;

    @Autowired
    public TripService(TripRepository tripRepository, TripMapper tripMapper) {
        this.tripRepository = tripRepository;
        this.tripMapper = tripMapper;
    }

    public List<TripDto> findAll() {
        return tripRepository.findAll().stream()
            .map(tripMapper::toDto)
            .collect(Collectors.toList());
    }

    public Optional<TripDto> findById(UUID id) {
        return tripRepository.findById(id)
            .map(tripMapper::toDto);
    }

    public TripDto save(Trip trip) {
        return tripMapper.toDto(tripRepository.save(trip));
    }

    public void deleteById(UUID id) {
        tripRepository.deleteById(id);
    }

    public List<TripDto> findByDriverId(UUID driverId) {
        return tripRepository.findByDriverId(driverId).stream()
            .map(tripMapper::toDto)
            .collect(java.util.stream.Collectors.toList());
    }
} 