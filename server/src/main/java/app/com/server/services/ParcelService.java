package app.com.server.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.com.server.dto.ParcelDto;
import app.com.server.mapper.ParcelMapper;
import app.com.server.models.Parcel;
import app.com.server.repositories.ParcelRepository;

@Service
public class ParcelService {
    private final ParcelRepository parcelRepository;
    private final ParcelMapper parcelMapper;

    @Autowired
    public ParcelService(ParcelRepository parcelRepository, ParcelMapper parcelMapper) {
        this.parcelRepository = parcelRepository;
        this.parcelMapper = parcelMapper;
    }

    public List<ParcelDto> findAll() {
        return parcelRepository.findAll().stream()
            .map(parcelMapper::toDto)
            .collect(Collectors.toList());
    }

    public Optional<ParcelDto> findById(UUID id) {
        return parcelRepository.findById(id)
            .map(parcelMapper::toDto);
    }

    public ParcelDto save(Parcel parcel) {
        return parcelMapper.toDto(parcelRepository.save(parcel));
    }

    public void deleteById(UUID id) {
        parcelRepository.deleteById(id);
    }
} 