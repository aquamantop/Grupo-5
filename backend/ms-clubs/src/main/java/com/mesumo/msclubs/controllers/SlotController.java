package com.mesumo.msclubs.controllers;

import com.mesumo.msclubs.exceptions.ResourceNotFoundException;
import com.mesumo.msclubs.models.dto.SlotDTO;
import com.mesumo.msclubs.models.entities.Slot;
import com.mesumo.msclubs.models.service.ISlotService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/slot")
public class SlotController {

    private final ISlotService slotService;

    public SlotController(ISlotService slotService) {
        this.slotService = slotService;
    }

    @GetMapping("/")
    public ResponseEntity<List<Slot>> getAll() {
        ResponseEntity<List<Slot>> response;
        List<Slot> slots = slotService.findAll();

        if(slots != null){
            response = ResponseEntity.ok(slots);
        } else {
            response = ResponseEntity.notFound().build();
        }

        return response;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Slot> getById(@PathVariable Long id) throws ResourceNotFoundException {
        ResponseEntity<Slot> response;
        Slot slot = slotService.findById(id);

        if(slot != null){
            response = ResponseEntity.ok(slot);
        } else {
            response = ResponseEntity.notFound().build();
        }

        return response;
    }

    @PostMapping("/add")
    public ResponseEntity<Slot> add(@RequestBody Slot slot){
        ResponseEntity<Slot> response;
        if(slot != null){
            response = ResponseEntity.ok(slotService.create(slot));
        } else {
            response = ResponseEntity.badRequest().build();
        }
        return response;
    }

    @PutMapping("/update")
    public ResponseEntity<Slot> update(@RequestBody Slot slot) throws ResourceNotFoundException {
        ResponseEntity<Slot> response;
        if(slot != null){
            response = ResponseEntity.ok(slotService.update(slot));
        } else {
            response = ResponseEntity.badRequest().build();
        }
        return response;
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) throws ResourceNotFoundException {
        ResponseEntity<?> response;
        if(id != null){
            slotService.deleteById(id);
            response = ResponseEntity.ok().build();
        } else {
            response = ResponseEntity.badRequest().build();
        }
        return response;
    }

    @GetMapping("/getWithCourt/{id}")
    public ResponseEntity<SlotDTO> getSlotWithCourtById (@PathVariable Long id) throws ResourceNotFoundException {
        ResponseEntity<SlotDTO> response;

        if(id > 0){
            response = new ResponseEntity<>(slotService.getSlotWithCourtById(id), HttpStatus.OK);
        } else response = ResponseEntity.badRequest().build();

        return response;
    }
  
}
