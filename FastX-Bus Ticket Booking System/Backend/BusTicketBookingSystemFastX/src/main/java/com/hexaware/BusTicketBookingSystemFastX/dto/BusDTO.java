package com.hexaware.BusTicketBookingSystemFastX.dto;

public class BusDTO {

    private int busId;
    private String busName;
    private String busNumber;
    private String busType;
    private int totalSeats;
    private int operatorId;
    private String serviceNumber;

    public BusDTO() {}

    public BusDTO(int busId, String busName, String busNumber,
                  String busType, int totalSeats, int operatorId) {
        this.busId = busId;
        this.busName = busName;
        this.busNumber = busNumber;
        this.busType = busType;
        this.totalSeats = totalSeats;
        this.operatorId = operatorId;
    }

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

    public int getOperatorId() { return operatorId; }

    public void setOperatorId(int operatorId) { this.operatorId = operatorId; }

    public String getServiceNumber() { return serviceNumber; }

    public void setServiceNumber(String serviceNumber) { this.serviceNumber = serviceNumber; }

}