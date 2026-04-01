package com.hexaware.BusTicketBookingSystemFastX.dto;

public class JwtBlacklistDTO {

    private int id;
    private String token;

    public JwtBlacklistDTO() {}

    public JwtBlacklistDTO(int id, String token) {
        this.id = id;
        this.token = token;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}