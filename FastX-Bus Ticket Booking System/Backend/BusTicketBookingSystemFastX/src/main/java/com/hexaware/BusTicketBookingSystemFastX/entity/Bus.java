package com.hexaware.BusTicketBookingSystemFastX.entity;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="buses")

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Component
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int busId;

    private String busName;
    private String busNumber;
    private String busType;
    private int totalSeats;
    private String serviceNumber;

    @ManyToOne
    @JoinColumn(name="operator_id")
    private BusOperator operator;

    @OneToMany(mappedBy="bus", cascade=CascadeType.ALL)
    private List<Route> routes;

    @ManyToMany
    @JoinTable(
        name="bus_amenities",
        joinColumns=@JoinColumn(name="bus_id"),
        inverseJoinColumns=@JoinColumn(name="amenity_id")
    )
    private Set<Amenity> amenities;

    public int getBusId() { return busId; }
    public void setBusId(int busId) { this.busId = busId; }
    public String getBusName() { return busName; }
    public void setBusName(String busName) { this.busName = busName; }
    public String getBusNumber() { return busNumber; }
    public void setBusNumber(String busNumber) { this.busNumber = busNumber; }
    public String getBusType() { return busType; }
    public void setBusType(String busType) { this.busType = busType; }
    public int getTotalSeats() { return totalSeats; }
    public void setTotalSeats(int totalSeats) { this.totalSeats = totalSeats; }
    public String getServiceNumber() { return serviceNumber; }
    public void setServiceNumber(String serviceNumber) { this.serviceNumber = serviceNumber; }
}