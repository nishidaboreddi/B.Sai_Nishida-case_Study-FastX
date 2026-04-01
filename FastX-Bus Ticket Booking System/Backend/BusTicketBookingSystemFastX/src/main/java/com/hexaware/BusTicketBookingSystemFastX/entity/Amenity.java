package com.hexaware.BusTicketBookingSystemFastX.entity;

import java.util.Set;

import org.springframework.stereotype.Component;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="amenities")

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Component
public class Amenity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int amenityId;

    private String amenityName;

    @ManyToMany(mappedBy="amenities")
    private Set<Bus> buses;

}