package com.hexaware.BusTicketBookingSystemFastX.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.hexaware.BusTicketBookingSystemFastX.dto.BusOperatorDTO;
import com.hexaware.BusTicketBookingSystemFastX.service.IBusOperatorService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/operators")

public class BusOperatorController {

    @Autowired
    private IBusOperatorService service;

    @PostMapping("/add")
    public BusOperatorDTO addOperator(@Valid @RequestBody BusOperatorDTO dto) {
        return service.addOperator(dto);
    }

    @GetMapping("/get/{id}")
    public BusOperatorDTO getOperator(@PathVariable int id) {
        return service.getOperatorById(id);
    }

    @GetMapping("/getall")
    public List<BusOperatorDTO> getAllOperators() {
        return service.getAllOperators();
    }

    @DeleteMapping("/delete/{id}")
    public String deleteOperator(@PathVariable int id) {
        service.deleteOperator(id);
        return "Operator Deleted Successfully";
    }
}