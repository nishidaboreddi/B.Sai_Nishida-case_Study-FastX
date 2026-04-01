package com.hexaware.BusTicketBookingSystemFastX.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.BusTicketBookingSystemFastX.entity.BusAmenity;

@Repository
public interface IBusAmenityRepository extends JpaRepository<BusAmenity, Integer> {

}