package com.hexaware.BusTicketBookingSystemFastX.entity;

import org.springframework.stereotype.Component;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="locations")

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Component
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int locationId;

    private String city;
    private String state;

    public int getLocationId() { return locationId; }
    public void setLocationId(int locationId) { this.locationId = locationId; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
}