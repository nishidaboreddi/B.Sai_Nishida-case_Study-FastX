package com.hexaware.BusTicketBookingSystemFastX.entity;

import org.springframework.stereotype.Component;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="payments")

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Component
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int paymentId;

    private String paymentMethod;
    private String paymentStatus;

    @OneToOne
    @JoinColumn(name="booking_id")
    private Booking booking;

}