package com.hexaware.BusTicketBookingSystemFastX.mapper;

import com.hexaware.BusTicketBookingSystemFastX.dto.JwtBlacklistDTO;
import com.hexaware.BusTicketBookingSystemFastX.entity.JwtBlacklist;

public class JwtBlacklistMapper {

    public static JwtBlacklistDTO toDTO(JwtBlacklist jwt){

        if(jwt == null) return null;

        JwtBlacklistDTO dto = new JwtBlacklistDTO();

        dto.setId(jwt.getId());
        dto.setToken(jwt.getToken());

        return dto;
    }

    public static JwtBlacklist toEntity(JwtBlacklistDTO dto){

        if(dto == null) return null;

        JwtBlacklist jwt = new JwtBlacklist();

        jwt.setId(dto.getId());
        jwt.setToken(dto.getToken());

        return jwt;
    }
}