package com.hexaware.BusTicketBookingSystemFastX.dto;

public class SeatDTO {

    private int seatId;
    private int busId;
    private String seatNumber;

    public SeatDTO() {}

    public SeatDTO(int seatId, int busId, String seatNumber) {
        this.seatId = seatId;
        this.busId = busId;
        this.seatNumber = seatNumber;
    }

    public int getSeatId() {
        return seatId;
    }

    public void setSeatId(int seatId) {
        this.seatId = seatId;
    }

    public int getBusId() {
        return busId;
    }

    public void setBusId(int busId) {
        this.busId = busId;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }
}