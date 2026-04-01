package com.hexaware.BusTicketBookingSystemFastX.entity;

import java.util.List;

import org.springframework.stereotype.Component;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="routes")

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int routeId;

    private String departureTime;
    private String arrivalTime;
    private String departureDate;
    private double fare;

    private String origin;
    private String destination;
    private String serviceNumber;

    @ManyToOne
    @JoinColumn(name="bus_id")
    private Bus bus;

    @OneToMany(mappedBy="route", cascade=CascadeType.ALL)
    private List<Booking> bookings;

    public int getRouteId() { return routeId; }
    public void setRouteId(int routeId) { this.routeId = routeId; }
    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }
    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }
    public String getDepartureDate() { return departureDate; }
    public void setDepartureDate(String departureDate) { this.departureDate = departureDate; }
    public double getFare() { return fare; }
    public void setFare(double fare) { this.fare = fare; }
    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public Bus getBus() { return bus; }
    public void setBus(Bus bus) { this.bus = bus; }
}