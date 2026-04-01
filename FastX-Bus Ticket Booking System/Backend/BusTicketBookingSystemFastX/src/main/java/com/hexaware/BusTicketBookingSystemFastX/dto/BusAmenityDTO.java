package com.hexaware.BusTicketBookingSystemFastX.dto;

public class BusAmenityDTO {

    private int id;
    private int busId;
    private int amenityId;

    public BusAmenityDTO() {}

    public BusAmenityDTO(int id, int busId, int amenityId) {
        this.id = id;
        this.busId = busId;
        this.amenityId = amenityId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getBusId() {
        return busId;
    }

    public void setBusId(int busId) {
        this.busId = busId;
    }

    public int getAmenityId() {
        return amenityId;
    }

    public void setAmenityId(int amenityId) {
        this.amenityId = amenityId;
    }
}