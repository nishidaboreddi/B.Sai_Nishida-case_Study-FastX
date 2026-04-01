package com.hexaware.BusTicketBookingSystemFastX.dto;

public class RouteDTO {

    private int routeId;
    private int busId;
    private String origin;
    private String destination;
    private String departureTime;
    private String arrivalTime;
    private String departureDate;
    private String serviceNumber;
    private double fare;

    public RouteDTO() {}

    public RouteDTO(int routeId, int busId, String serviceNumber, String origin,
                    String destination, String departureTime,
                    String arrivalTime, String departureDate, double fare) {
        this.routeId = routeId;
        this.busId = busId;
        this.serviceNumber = serviceNumber;
        this.origin = origin;
        this.destination = destination;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.departureDate = departureDate;
        this.fare = fare;
    }

    public int getRouteId() { return routeId; }
    public void setRouteId(int routeId) { this.routeId = routeId; }

    public int getBusId() { return busId; }
    public void setBusId(int busId) { this.busId = busId; }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }

    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }

    public String getDepartureDate() { return departureDate; }
    public void setDepartureDate(String departureDate) { this.departureDate = departureDate; }

    public String getServiceNumber() { return serviceNumber; }
    public void setServiceNumber(String serviceNumber) { this.serviceNumber = serviceNumber; }

    public double getFare() { return fare; }
    public void setFare(double fare) { this.fare = fare; }

}