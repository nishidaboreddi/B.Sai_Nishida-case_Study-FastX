package com.hexaware.BusTicketBookingSystemFastX.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.hexaware.BusTicketBookingSystemFastX.dto.BookingDTO;
import com.hexaware.BusTicketBookingSystemFastX.service.IBookingService;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/bookings")

public class BookingController {

    @Autowired
    private IBookingService service;

    @PostMapping("/add")
    public BookingDTO addBooking(@RequestBody BookingDTO dto) {
        return service.addBooking(dto);
    }

    @GetMapping("/get/{id}")
    public BookingDTO getBooking(@PathVariable int id) {
        return service.getBookingById(id);
    }

    @GetMapping("/getall")
    public List<BookingDTO> getAllBookings() {
        return service.getAllBookings();
    }

    @GetMapping("/user/{userId}")
    public List<BookingDTO> getBookingsByUser(@PathVariable int userId) {
        return service.getBookingsByUserId(userId);
    }

    @GetMapping("/ticket/{ticketNo}")
    public BookingDTO getBookingByTicketNo(@PathVariable String ticketNo) {
        return service.getBookingByTicketNo(ticketNo);
    }

    @PostMapping("/refund/{id}")
    public BookingDTO refundBooking(@PathVariable int id) {
        return service.refundBooking(id);
    }
}
