package com.hexaware.BusTicketBookingSystemFastX.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.hexaware.BusTicketBookingSystemFastX.dto.AdminDTO;
import com.hexaware.BusTicketBookingSystemFastX.service.IAdminService;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/admins")
public class AdminController {

    @Autowired
    private IAdminService service;

    @PostMapping("/add")
    public AdminDTO addAdmin(@RequestBody AdminDTO dto) {
        return service.addAdmin(dto);
    }

    @GetMapping("/get/{id}")
    public AdminDTO getAdmin(@PathVariable int id) {
        return service.getAdminById(id);
    }

    @GetMapping("/getall")
    public List<AdminDTO> getAllAdmins() {
        return service.getAllAdmins();
    }
}
