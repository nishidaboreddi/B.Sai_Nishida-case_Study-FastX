package com.hexaware.BusTicketBookingSystemFastX.entity;

import org.springframework.stereotype.Component;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="bus_amenities")

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Component
public class BusAmenity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name="bus_id")
    private Bus bus;

    @ManyToOne
    @JoinColumn(name="amenity_id")
    private Amenity amenity;

}