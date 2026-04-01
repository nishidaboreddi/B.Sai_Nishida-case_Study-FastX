package com.hexaware.BusTicketBookingSystemFastX.dto;

public class AmenityDTO {

    private int amenityId;
    private String amenityName;

    public AmenityDTO() {}

    public AmenityDTO(int amenityId, String amenityName) {
        this.amenityId = amenityId;
        this.amenityName = amenityName;
    }

    public int getAmenityId() {
        return amenityId;
    }

    public void setAmenityId(int amenityId) {
        this.amenityId = amenityId;
    }

    public String getAmenityName() {
        return amenityName;
    }

    public void setAmenityName(String amenityName) {
        this.amenityName = amenityName;
    }
}