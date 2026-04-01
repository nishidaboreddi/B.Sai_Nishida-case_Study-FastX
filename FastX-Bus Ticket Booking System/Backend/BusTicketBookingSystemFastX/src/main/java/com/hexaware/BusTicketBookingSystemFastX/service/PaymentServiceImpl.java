package com.hexaware.BusTicketBookingSystemFastX.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.BusTicketBookingSystemFastX.dto.PaymentDTO;
import com.hexaware.BusTicketBookingSystemFastX.entity.Payment;
import com.hexaware.BusTicketBookingSystemFastX.mapper.PaymentMapper;
import com.hexaware.BusTicketBookingSystemFastX.repository.IPaymentRepository;

@Service
public class PaymentServiceImpl implements IPaymentService {

    @Autowired
    private IPaymentRepository repo;

    @Override
    public PaymentDTO addPayment(PaymentDTO dto) {

        Payment payment = PaymentMapper.toEntity(dto);

        payment = repo.save(payment);

        return PaymentMapper.toDTO(payment);
    }

}