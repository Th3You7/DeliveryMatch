package app.com.server.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.com.server.dto.ParcelDto;
import app.com.server.models.Parcel;
import app.com.server.services.ParcelService;

@RestController
@RequestMapping("/api/parcels")
public class ParcelController {
    private final ParcelService parcelService;

    public ParcelController(ParcelService parcelService) {
        this.parcelService = parcelService;
    }

    @GetMapping
    public List<ParcelDto> getAll() {
        return parcelService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParcelDto> getById(@PathVariable UUID id) {
        return parcelService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ParcelDto create(@RequestBody Parcel parcel) {
        return parcelService.save(parcel);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParcelDto> update(@PathVariable UUID id, @RequestBody Parcel parcel) {
        if (!parcelService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        parcel.setId(id);
        return ResponseEntity.ok(parcelService.save(parcel));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!parcelService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        parcelService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
} 