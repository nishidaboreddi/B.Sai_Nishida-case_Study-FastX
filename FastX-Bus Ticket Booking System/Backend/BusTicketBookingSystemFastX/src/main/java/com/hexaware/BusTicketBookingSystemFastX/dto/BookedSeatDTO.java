package com.hexaware.BusTicketBookingSystemFastX.dto;

public class BookedSeatDTO {

    private int id;
    private int bookingId;
    private int seatId;

    public BookedSeatDTO() {}

    public BookedSeatDTO(int id, int bookingId, int seatId) {
        this.id = id;
        this.bookingId = bookingId;
        this.seatId = seatId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getBookingId() {
        return bookingId;
    }

    public void setBookingId(int bookingId) {
        this.bookingId = bookingId;
    }

    public int getSeatId() {
        return seatId;
    }

    public void setSeatId(int seatId) {
        this.seatId = seatId;
    }
}