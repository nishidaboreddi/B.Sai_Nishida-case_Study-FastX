package com.hexaware.BusTicketBookingSystemFastX.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.BusTicketBookingSystemFastX.entity.Refund;

@Repository
public interface IRefundRepository extends JpaRepository<Refund, Integer> {

}