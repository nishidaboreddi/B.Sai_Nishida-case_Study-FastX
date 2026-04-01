package com.hexaware.BusTicketBookingSystemFastX.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.hexaware.BusTicketBookingSystemFastX.dto.UserDTO;
import com.hexaware.BusTicketBookingSystemFastX.service.IUserService;

@RestController
@RequestMapping("/api/users")

public class UserController {

    @Autowired
    private IUserService service;

    @PostMapping("/add")
    public UserDTO addUser(@RequestBody UserDTO dto) {
        return service.addUser(dto);
    }

    @PutMapping("/update")
    public UserDTO updateUser(@RequestBody UserDTO dto) {
        return service.updateUser(dto);
    }

    @GetMapping("/get/{id}")
    public UserDTO getUser(@PathVariable int id) {
        return service.getUserById(id);
    }

    @GetMapping("/getall")
    public List<UserDTO> getAllUsers() {
        return service.getAllUsers();
    }

    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable int id) {
        service.deleteUser(id);
        return "User Deleted Successfully";
    }
}