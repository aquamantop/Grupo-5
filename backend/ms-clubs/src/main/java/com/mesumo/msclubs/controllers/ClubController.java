package com.mesumo.msclubs.controllers;

import com.mesumo.msclubs.exceptions.ResourceNotFoundException;
import com.mesumo.msclubs.models.dto.ClubDTO;
import com.mesumo.msclubs.models.entities.Club;
import com.mesumo.msclubs.models.service.impl.ClubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/club")
@RequiredArgsConstructor
public class ClubController {

    private final ClubService service;

    @GetMapping("/{id}")
    public ResponseEntity<Club> getById(@PathVariable Long id) throws ResourceNotFoundException {
        ResponseEntity<Club> response;

        response = new ResponseEntity<>(service.findById(id), HttpStatus.OK);

        return response;
    }

    @GetMapping("/by-name/{name}")
    public ResponseEntity<Club> getByName(@PathVariable String name) throws ResourceNotFoundException {
        ResponseEntity<Club> response;

        response = new ResponseEntity<>(service.findByName(name), HttpStatus.OK);

        return response;
    }

    @GetMapping("/")
    public ResponseEntity<?> getAll() {
        ResponseEntity<?> response;
        List<Club> list = service.findAll();

        if(list != null){
            response = new ResponseEntity<>(list, HttpStatus.OK);
        } else response = new ResponseEntity<>("Empty list", HttpStatus.NOT_FOUND);

        return response;
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody Club club){
        ResponseEntity<?> response;

        if(club != null){
            response = new ResponseEntity<>(service.create(club), HttpStatus.CREATED);
        } else response = new ResponseEntity<>("Complete the fields", HttpStatus.BAD_REQUEST);

        return response;
    }

    @PutMapping("/update")
    public ResponseEntity<?> update (@RequestBody Club club) throws ResourceNotFoundException {
        ResponseEntity<?> response;

        if(club.getId() != null){
            response = new ResponseEntity<>(service.update(club), HttpStatus.OK);
        } else response = new ResponseEntity<>("Complete id field", HttpStatus.BAD_REQUEST);

        return response;
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete (@PathVariable Long id) throws ResourceNotFoundException {
        ResponseEntity<?> response;

        service.deleteById(id);
        response = new ResponseEntity<>("Club deleted with id: " + id, HttpStatus.OK);

        return response;
    }

    @GetMapping("/DTO/{id}")
    public ResponseEntity<ClubDTO> getByIdDTO(@PathVariable Long id) throws ResourceNotFoundException {
        ResponseEntity<ClubDTO> response;

        response = new ResponseEntity<>(service.findByIdDTO(id), HttpStatus.OK);

        return response;
    }

    @GetMapping("/listDTO")
    public ResponseEntity<?> getAllDTO() {
        ResponseEntity<?> response;
        List<ClubDTO> list = service.findAllDTO();

        if(list != null){
            response = new ResponseEntity<>(list, HttpStatus.OK);
        } else response = new ResponseEntity<>("Empty list", HttpStatus.NOT_FOUND);

        return response;
    }

}
