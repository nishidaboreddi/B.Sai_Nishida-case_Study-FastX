package com.hexaware.BusTicketBookingSystemFastX.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.BusTicketBookingSystemFastX.entity.BookedSeat;

@Repository
public interface IBookedSeatRepository extends JpaRepository<BookedSeat, Integer> {

}