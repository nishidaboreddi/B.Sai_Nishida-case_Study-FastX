package com.hexaware.BusTicketBookingSystemFastX.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.BusTicketBookingSystemFastX.entity.Bus;

@Repository
public interface IBusRepository extends JpaRepository<Bus, Integer> {

}