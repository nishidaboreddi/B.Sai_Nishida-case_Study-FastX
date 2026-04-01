package com.hexaware.BusTicketBookingSystemFastX.mapper;

import com.hexaware.BusTicketBookingSystemFastX.dto.BusAmenityDTO;
import com.hexaware.BusTicketBookingSystemFastX.entity.BusAmenity;

public class BusAmenityMapper {

    public static BusAmenityDTO toDTO(BusAmenity busAmenity){

        if(busAmenity == null) return null;

        BusAmenityDTO dto = new BusAmenityDTO();

        dto.setId(busAmenity.getId());

        if(busAmenity.getBus() != null)
            dto.setBusId(busAmenity.getBus().getBusId());

        if(busAmenity.getAmenity() != null)
            dto.setAmenityId(busAmenity.getAmenity().getAmenityId());

        return dto;
    }

    public static BusAmenity toEntity(BusAmenityDTO dto){

        if(dto == null) return null;

        BusAmenity busAmenity = new BusAmenity();

        busAmenity.setId(dto.getId());

        return busAmenity;
    }
}