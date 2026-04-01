package com.hexaware.BusTicketBookingSystemFastX.mapper;

import com.hexaware.BusTicketBookingSystemFastX.dto.AmenityDTO;
import com.hexaware.BusTicketBookingSystemFastX.entity.Amenity;

public class AmenityMapper {

    public static AmenityDTO toDTO(Amenity amenity){

        AmenityDTO dto = new AmenityDTO();

        dto.setAmenityId(amenity.getAmenityId());
        dto.setAmenityName(amenity.getAmenityName());

        return dto;
    }

    public static Amenity toEntity(AmenityDTO dto){

        Amenity amenity = new Amenity();

        amenity.setAmenityId(dto.getAmenityId());
        amenity.setAmenityName(dto.getAmenityName());

        return amenity;
    }
}