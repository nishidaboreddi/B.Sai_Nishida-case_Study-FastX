package com.hexaware.BusTicketBookingSystemFastX.service;

import java.util.List;
import com.hexaware.BusTicketBookingSystemFastX.dto.RouteDTO;

public interface IRouteService {

    RouteDTO addRoute(RouteDTO dto);

    RouteDTO getRouteById(int id);

    List<RouteDTO> getAllRoutes();

    void deleteRoute(int id);

}