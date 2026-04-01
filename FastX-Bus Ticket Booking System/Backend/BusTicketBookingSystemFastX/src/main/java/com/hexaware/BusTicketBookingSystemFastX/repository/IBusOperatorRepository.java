package com.hexaware.BusTicketBookingSystemFastX.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.BusTicketBookingSystemFastX.entity.BusOperator;

@Repository
public interface IBusOperatorRepository extends JpaRepository<BusOperator, Integer> {
    Optional<BusOperator> findByEmail(String email);
}