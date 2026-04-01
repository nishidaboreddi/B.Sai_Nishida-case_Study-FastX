package com.hexaware.BusTicketBookingSystemFastX.dto;

public class LocationDTO {

    private int locationId;
    private String city;
    private String state;

    public LocationDTO() {}

    public LocationDTO(int locationId, String city, String state) {
        this.locationId = locationId;
        this.city = city;
        this.state = state;
    }

    public int getLocationId() {
        return locationId;
    }

    public void setLocationId(int locationId) {
        this.locationId = locationId;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }
}