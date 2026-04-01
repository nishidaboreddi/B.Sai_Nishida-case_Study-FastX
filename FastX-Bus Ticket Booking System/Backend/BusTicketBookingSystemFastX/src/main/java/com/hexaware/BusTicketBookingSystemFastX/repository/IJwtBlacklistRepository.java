package com.hexaware.BusTicketBookingSystemFastX.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.BusTicketBookingSystemFastX.entity.JwtBlacklist;

@Repository
public interface IJwtBlacklistRepository extends JpaRepository<JwtBlacklist, Integer> {

}