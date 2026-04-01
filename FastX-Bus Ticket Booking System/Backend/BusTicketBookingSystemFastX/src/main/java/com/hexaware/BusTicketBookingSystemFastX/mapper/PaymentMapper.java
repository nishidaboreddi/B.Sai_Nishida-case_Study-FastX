package com.hexaware.BusTicketBookingSystemFastX.mapper;

import com.hexaware.BusTicketBookingSystemFastX.dto.PaymentDTO;
import com.hexaware.BusTicketBookingSystemFastX.entity.Payment;

public class PaymentMapper {

    public static PaymentDTO toDTO(Payment payment){

        PaymentDTO dto = new PaymentDTO();

        dto.setPaymentId(payment.getPaymentId());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setPaymentStatus(payment.getPaymentStatus());

        return dto;
    }

    public static Payment toEntity(PaymentDTO dto){

        Payment payment = new Payment();

        payment.setPaymentId(dto.getPaymentId());
        payment.setPaymentMethod(dto.getPaymentMethod());
        payment.setPaymentStatus(dto.getPaymentStatus());

        return payment;
    }
}