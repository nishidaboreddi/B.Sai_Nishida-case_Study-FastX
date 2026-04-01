package com.hexaware.BusTicketBookingSystemFastX.dto;

public class BookingDTO {

    private int bookingId;
    private int userId;
    private int routeId;
    private double totalAmount;
    private String bookingStatus;
    private String bookingDate;
    private String journeyDate;
    private double fare;
    
    private String ticketNo;
    private String routeName;
    private String busOperator;
    private String departureTime;
    private String seatNumbers;
    private String serviceNo;

    public BookingDTO() {}

    public BookingDTO(int bookingId, int userId,
                      int routeId, double totalAmount,
                      String bookingStatus, String bookingDate, String journeyDate,
                      String ticketNo, String routeName, String busOperator,
                      String departureTime, String seatNumbers, String serviceNo, double fare) {
        this.bookingId = bookingId;
        this.userId = userId;
        this.routeId = routeId;
        this.totalAmount = totalAmount;
        this.bookingStatus = bookingStatus;
        this.bookingDate = bookingDate;
        this.journeyDate = journeyDate;
        this.ticketNo = ticketNo;
        this.routeName = routeName;
        this.busOperator = busOperator;
        this.departureTime = departureTime;
        this.seatNumbers = seatNumbers;
        this.serviceNo = serviceNo;
        this.fare = fare;
    }

    public int getBookingId() { return bookingId; }

    public void setBookingId(int bookingId) { this.bookingId = bookingId; }

    public int getUserId() { return userId; }

    public void setUserId(int userId) { this.userId = userId; }

    public int getRouteId() { return routeId; }

    public void setRouteId(int routeId) { this.routeId = routeId; }

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