package com.hexaware.BusTicketBookingSystemFastX.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.hexaware.BusTicketBookingSystemFastX.dto.RouteDTO;
import com.hexaware.BusTicketBookingSystemFastX.service.IRouteService;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/routes")

public class RouteController {

    @Autowired
    private IRouteService service;

    @PostMapping("/add")
    public RouteDTO addRoute(@RequestBody RouteDTO dto) {
        return service.addRoute(dto);
    }

    @GetMapping("/get/{id}")
    public RouteDTO getRoute(@PathVariable int id) {
        return service.getRouteById(id);
    }

    @GetMapping("/getall")
    public List<RouteDTO> getAllRoutes() {
        return service.getAllRoutes();
    }

    @DeleteMapping("/delete/{id}")
    public String deleteRoute(@PathVariable int id) {
        service.deleteRoute(id);
        return "Route Deleted Successfully";
    }
}