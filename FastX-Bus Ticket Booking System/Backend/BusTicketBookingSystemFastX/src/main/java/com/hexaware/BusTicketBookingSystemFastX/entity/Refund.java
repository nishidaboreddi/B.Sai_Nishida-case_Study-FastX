package com.hexaware.BusTicketBookingSystemFastX.entity;

import org.springframework.stereotype.Component;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="refunds")

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Component
public class Refund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int refundId;

    private double refundAmount;

    @OneToOne
    @JoinColumn(name="booking_id")
    private Booking booking;

    public int getRefundId() { return refundId; }
    public void setRefundId(int refundId) { this.refundId = refundId; }
    public double getRefundAmount() { return refundAmount; }
    public void setRefundAmount(double refundAmount) { this.refundAmount = refundAmount; }
    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }
}