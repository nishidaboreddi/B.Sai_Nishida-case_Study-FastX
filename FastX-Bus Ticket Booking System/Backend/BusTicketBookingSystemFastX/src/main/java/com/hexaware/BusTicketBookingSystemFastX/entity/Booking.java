package com.hexaware.BusTicketBookingSystemFastX.entity;

import java.util.Set;

import org.springframework.stereotype.Component;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="bookings")

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Component
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int bookingId;

    private double totalAmount;
    private String bookingStatus;
    private String bookingDate;
    private String journeyDate;
    private double fare;
    
    // Additional simple string fields to support the frontend MyTrips page easily
    private String ticketNo;
    private String routeName;
    private String busOperator;
    private String departureTime;
    private String seatNumbers;
    private String serviceNo;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name="route_id")
    private Route route;

    @ManyToMany
    @JoinTable(
        name="booking_seats",
        joinColumns=@JoinColumn(name="booking_id"),
        inverseJoinColumns=@JoinColumn(name="seat_id")
    )
    private Set<Seat> seats;

    // Cascade to payment and refund so they are deleted when a booking is deleted
    @OneToOne(mappedBy="booking", cascade=CascadeType.ALL, orphanRemoval=true)
    private Payment payment;

    @OneToOne(mappedBy="booking", cascade=CascadeType.ALL, orphanRemoval=true)
    private Refund refund;

    public int getBookingId() { return bookingId; }
    public void setBookingId(int bookingId) { this.bookingId = bookingId; }
    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }
    public String getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(String bookingStatus) { this.bookingStatus = bookingStatus; }
    public String getBookingDate() { return bookingDate; }
    public void setBookingDate(String bookingDate) { this.bookingDate = bookingDate; }
    public String getJourneyDate() { return journeyDate; }
    public void setJourneyDate(String journeyDate) { this.journeyDate = journeyDate; }
    public double getFare() { return fare; }
    public void setFare(double fare) { this.fare = fare; }

    public String getTicketNo() { return ticketNo; }
    public void setTicketNo(String ticketNo) { this.ticketNo = ticketNo; }
    public String getRouteName() { return routeName; }
    public void setRouteName(String routeName) { this.routeName = routeName; }
    public String getBusOperator() { return busOperator; }
    public void setBusOperator(String busOperator) { this.busOperator = busOperator; }
    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }
    public String getSeatNumbers() { return seatNumbers; }
    public void setSeatNumbers(String seatNumbers) { this.seatNumbers = seatNumbers; }
    public String getServiceNo() { return serviceNo; }
    public void setServiceNo(String serviceNo) { this.serviceNo = serviceNo; }
}