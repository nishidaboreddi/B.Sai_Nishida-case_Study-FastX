package com.hexaware.BusTicketBookingSystemFastX.mapper;

import com.hexaware.BusTicketBookingSystemFastX.dto.LocationDTO;
import com.hexaware.BusTicketBookingSystemFastX.entity.Location;

public class LocationMapper {

    public static LocationDTO toDTO(Location location){

        if(location == null) return null;

        LocationDTO dto = new LocationDTO();

        dto.setLocationId(location.getLocationId());
        dto.setCity(location.getCity());
        dto.setState(location.getState());

        return dto;
    }

    public static Location toEntity(LocationDTO dto){

        if(dto == null) return null;

        Location location = new Location();

        location.setLocationId(dto.getLocationId());
        location.setCity(dto.getCity());
        location.setState(dto.getState());

        return location;
    }
}