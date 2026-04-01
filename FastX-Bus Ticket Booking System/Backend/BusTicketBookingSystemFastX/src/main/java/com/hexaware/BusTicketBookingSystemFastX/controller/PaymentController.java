package com.hexaware.BusTicketBookingSystemFastX.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.hexaware.BusTicketBookingSystemFastX.dto.PaymentDTO;
import com.hexaware.BusTicketBookingSystemFastX.service.IPaymentService;

@RestController
@RequestMapping("/api/payments")

public class PaymentController {

    @Autowired
    private IPaymentService service;

    @PostMapping("/add")
    public PaymentDTO makePayment(@RequestBody PaymentDTO dto) {
        return service.addPayment(dto);
    }
}