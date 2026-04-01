package com.hexaware.BusTicketBookingSystemFastX.mapper;

import com.hexaware.BusTicketBookingSystemFastX.dto.RouteDTO;
import com.hexaware.BusTicketBookingSystemFastX.entity.Route;

public class RouteMapper {

    public static RouteDTO toDTO(Route route){

        RouteDTO dto = new RouteDTO();

        dto.setRouteId(route.getRouteId());
        dto.setDepartureTime(route.getDepartureTime());
        dto.setArrivalTime(route.getArrivalTime());
        dto.setDepartureDate(route.getDepartureDate());
        dto.setFare(route.getFare());
        dto.setOrigin(route.getOrigin());
        dto.setDestination(route.getDestination());
        dto.setBusId(route.getBus() != null ? route.getBus().getBusId() : 0);
        // Prefer route-specific service number, fallback to bus default
        dto.setServiceNumber(route.getServiceNumber() != null ? route.getServiceNumber() : 
                           (route.getBus() != null ? route.getBus().getServiceNumber() : "N/A"));

        return dto;
    }

    public static Route toEntity(RouteDTO dto){

        Route route = new Route();

        route.setRouteId(dto.getRouteId());
        route.setDepartureTime(dto.getDepartureTime());
        route.setArrivalTime(dto.getArrivalTime());
        route.setDepartureDate(dto.getDepartureDate());
        route.setFare(dto.getFare());
        route.setOrigin(dto.getOrigin());
        route.setDestination(dto.getDestination());
        route.setServiceNumber(dto.getServiceNumber());

        if (dto.getBusId() > 0) {
            com.hexaware.BusTicketBookingSystemFastX.entity.Bus bus = new com.hexaware.BusTicketBookingSystemFastX.entity.Bus();
            bus.setBusId(dto.getBusId());
            route.setBus(bus);
        }

        return route;
    }
}