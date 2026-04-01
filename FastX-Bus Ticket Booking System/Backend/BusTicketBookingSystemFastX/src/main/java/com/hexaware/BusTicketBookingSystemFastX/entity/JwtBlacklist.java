package com.hexaware.BusTicketBookingSystemFastX.entity;

import org.springframework.stereotype.Component;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="jwt_blacklist")

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Component
public class JwtBlacklist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String token;

}