package app.com.server.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.com.server.dto.TripStopsDto;
import app.com.server.mapper.TripStopsMapper;
import app.com.server.models.TripStops;
import app.com.server.repositories.TripStopsRepository;

@Service
public class TripStopsService {
    private final TripStopsRepository tripStopsRepository;
    private final TripStopsMapper tripStopsMapper;

    @Autowired
    public TripStopsService(TripStopsRepository tripStopsRepository, TripStopsMapper tripStopsMapper) {
        this.tripStopsRepository = tripStopsRepository;
        this.tripStopsMapper = tripStopsMapper;
    }

    public List<TripStopsDto> findAll() {
        return tripStopsRepository.findAll().stream()
            .map(tripStopsMapper::toDto)
            .collect(Collectors.toList());
    }

    public Optional<TripStopsDto> findById(UUID id) {
        return tripStopsRepository.findById(id)
            .map(tripStopsMapper::toDto);
    }

    public TripStopsDto save(TripStops tripStops) {
        return tripStopsMapper.toDto(tripStopsRepository.save(tripStops));
    }

    public void deleteById(UUID id) {
        tripStopsRepository.deleteById(id);
    }

    public List<TripStopsDto> findByTripId(UUID tripId) {
        return tripStopsRepository.findByTripId(tripId).stream()
            .map(tripStopsMapper::toDto)
            .collect(Collectors.toList());
    }
} 