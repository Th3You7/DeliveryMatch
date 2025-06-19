package app.com.server.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.com.server.dto.TripRequestDto;
import app.com.server.mapper.TripRequestMapper;
import app.com.server.models.TripRequest;
import app.com.server.repositories.TripRequestRepository;

@Service
public class TripRequestService {
    private final TripRequestRepository tripRequestRepository;
    private final TripRequestMapper tripRequestMapper;

    @Autowired
    public TripRequestService(TripRequestRepository tripRequestRepository, TripRequestMapper tripRequestMapper) {
        this.tripRequestRepository = tripRequestRepository;
        this.tripRequestMapper = tripRequestMapper;
    }

    public List<TripRequestDto> findAll() {
        return tripRequestRepository.findAll().stream()
            .map(tripRequestMapper::toDto)
            .collect(Collectors.toList());
    }

    public Optional<TripRequestDto> findById(UUID id) {
        return tripRequestRepository.findById(id)
            .map(tripRequestMapper::toDto);
    }

    public TripRequestDto save(TripRequest tripRequest) {
        return tripRequestMapper.toDto(tripRequestRepository.save(tripRequest));
    }

    public void deleteById(UUID id) {
        tripRequestRepository.deleteById(id);
    }
} 