package com.hexaware.BusTicketBookingSystemFastX.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.BusTicketBookingSystemFastX.entity.Admin;

@Repository
public interface IAdminRepository extends JpaRepository<Admin, Integer> {
    Optional<Admin> findByEmail(String email);
}