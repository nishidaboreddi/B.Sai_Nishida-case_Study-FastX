package com.hexaware.BusTicketBookingSystemFastX.entity;

import java.util.Set;

import org.springframework.stereotype.Component;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="seats")

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Component
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int seatId;

    private String seatNumber;

    @ManyToMany(mappedBy="seats")
    private Set<Booking> bookings;

    public int getSeatId() { return seatId; }
    public void setSeatId(int seatId) { this.seatId = seatId; }
    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
}