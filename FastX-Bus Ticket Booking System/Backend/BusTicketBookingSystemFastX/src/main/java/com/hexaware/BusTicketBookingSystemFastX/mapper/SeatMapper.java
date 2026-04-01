package com.hexaware.BusTicketBookingSystemFastX.mapper;

import com.hexaware.BusTicketBookingSystemFastX.dto.SeatDTO;
import com.hexaware.BusTicketBookingSystemFastX.entity.Seat;

public class SeatMapper {

    public static SeatDTO toDTO(Seat seat){

        SeatDTO dto = new SeatDTO();

        dto.setSeatId(seat.getSeatId());
        dto.setSeatNumber(seat.getSeatNumber());

        return dto;
    }

    public static Seat toEntity(SeatDTO dto){

        Seat seat = new Seat();

        seat.setSeatId(dto.getSeatId());
        seat.setSeatNumber(dto.getSeatNumber());

        return seat;
    }
}