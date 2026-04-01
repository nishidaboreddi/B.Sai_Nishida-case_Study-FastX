package com.hexaware.BusTicketBookingSystemFastX.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.BusTicketBookingSystemFastX.entity.Route;

@Repository
public interface IRouteRepository extends JpaRepository<Route, Integer> {

}