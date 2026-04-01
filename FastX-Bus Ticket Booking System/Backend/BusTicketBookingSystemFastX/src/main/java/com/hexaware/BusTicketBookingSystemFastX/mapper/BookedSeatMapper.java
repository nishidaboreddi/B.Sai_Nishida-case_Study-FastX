package com.hexaware.BusTicketBookingSystemFastX.mapper;

import com.hexaware.BusTicketBookingSystemFastX.dto.BookedSeatDTO;
import com.hexaware.BusTicketBookingSystemFastX.entity.BookedSeat;

public class BookedSeatMapper {

    public static BookedSeatDTO toDTO(BookedSeat bookedSeat){

        if(bookedSeat == null) return null;

        BookedSeatDTO dto = new BookedSeatDTO();

        dto.setId(bookedSeat.getId());

        if(bookedSeat.getBooking() != null)
            dto.setBookingId(bookedSeat.getBooking().getBookingId());

        if(bookedSeat.getSeat() != null)
            dto.setSeatId(bookedSeat.getSeat().getSeatId());

        return dto;
    }

    public static BookedSeat toEntity(BookedSeatDTO dto){

        if(dto == null) return null;

        BookedSeat bookedSeat = new BookedSeat();

        bookedSeat.setId(dto.getId());

        return bookedSeat;
    }
}