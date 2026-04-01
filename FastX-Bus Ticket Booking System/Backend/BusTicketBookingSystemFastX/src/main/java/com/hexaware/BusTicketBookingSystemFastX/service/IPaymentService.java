package com.hexaware.BusTicketBookingSystemFastX.service;

import com.hexaware.BusTicketBookingSystemFastX.dto.PaymentDTO;

public interface IPaymentService {

    PaymentDTO addPayment(PaymentDTO dto);

}