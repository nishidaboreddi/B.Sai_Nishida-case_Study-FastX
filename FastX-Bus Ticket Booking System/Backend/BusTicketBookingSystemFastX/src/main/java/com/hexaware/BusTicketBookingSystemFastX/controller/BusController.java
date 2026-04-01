package com.hexaware.BusTicketBookingSystemFastX.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.hexaware.BusTicketBookingSystemFastX.dto.BusDTO;
import com.hexaware.BusTicketBookingSystemFastX.service.IBusService;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/buses")

public class BusController {

    @Autowired
    private IBusService service;

    @PostMapping("/add")
    public BusDTO addBus(@RequestBody BusDTO dto) {
        return service.addBus(dto);
    }

    @PutMapping("/update")
    public BusDTO updateBus(@RequestBody BusDTO dto) {
        return service.updateBus(dto);
    }

    @GetMapping("/get/{id}")
    public BusDTO getBus(@PathVariable int id) {
        return service.getBusById(id);
    }

    @GetMapping("/getall")
    public List<BusDTO> getAllBuses() {
        return service.getAllBus();
    }

    @DeleteMapping("/delete/{id}")
    public String deleteBus(@PathVariable int id) {
        service.deleteBus(id);
        return "Bus deleted successfully";
    }
}