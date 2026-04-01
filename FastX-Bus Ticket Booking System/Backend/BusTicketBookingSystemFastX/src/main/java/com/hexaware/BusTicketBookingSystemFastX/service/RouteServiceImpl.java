package com.hexaware.BusTicketBookingSystemFastX.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.BusTicketBookingSystemFastX.dto.RouteDTO;
import com.hexaware.BusTicketBookingSystemFastX.entity.Route;
import com.hexaware.BusTicketBookingSystemFastX.mapper.RouteMapper;
import com.hexaware.BusTicketBookingSystemFastX.repository.IBusRepository;
import com.hexaware.BusTicketBookingSystemFastX.repository.IRouteRepository;

@Service
@Transactional
public class RouteServiceImpl implements IRouteService {

    @Autowired
    private IRouteRepository repo;

    @Autowired
    private IBusRepository busRepo;

    @Override
    public RouteDTO addRoute(RouteDTO dto) {
        if (dto.getBusId() <= 0) {
            throw new RuntimeException("A valid Bus ID is required to schedule a route.");
        }
        
        Route route = RouteMapper.toEntity(dto);
        com.hexaware.BusTicketBookingSystemFastX.entity.Bus bus = busRepo.findById(dto.getBusId())
                .orElseThrow(() -> new RuntimeException("Bus not found with ID: " + dto.getBusId()));
        
        route.setBus(bus);

        if (dto.getServiceNumber() != null && !dto.getServiceNumber().isEmpty()) {
            route.setServiceNumber(dto.getServiceNumber());
        } else {
            route.setServiceNumber(bus.getServiceNumber());
        }
        route = repo.save(route);
        return RouteMapper.toDTO(route);
    }

    @Override
    public RouteDTO getRouteById(int id) {

        Route route = repo.findById(id).orElse(null);

        return RouteMapper.toDTO(route);
    }

    @Override
    public List<RouteDTO> getAllRoutes() {

        List<Route> routes = repo.findAll();

        return routes.stream()
                .map(RouteMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteRoute(int id) {
        repo.deleteById(id);
    }

}