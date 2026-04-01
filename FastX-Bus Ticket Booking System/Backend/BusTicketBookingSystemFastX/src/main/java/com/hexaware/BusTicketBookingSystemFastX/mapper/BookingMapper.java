package com.hexaware.BusTicketBookingSystemFastX.mapper;

import com.hexaware.BusTicketBookingSystemFastX.dto.BookingDTO;
import com.hexaware.BusTicketBookingSystemFastX.entity.Booking;

public class BookingMapper {

    public static BookingDTO toDTO(Booking booking){

        BookingDTO dto = new BookingDTO();

        dto.setBookingId(booking.getBookingId());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setBookingStatus(booking.getBookingStatus());
        dto.setBookingDate(booking.getBookingDate());
        dto.setJourneyDate(booking.getJourneyDate());
        dto.setFare(booking.getFare());
        
        dto.setTicketNo(booking.getTicketNo());
        dto.setRouteName(booking.getRouteName());
        dto.setBusOperator(booking.getBusOperator());
        dto.setDepartureTime(booking.getDepartureTime());
        dto.setSeatNumbers(booking.getSeatNumbers());
        dto.setServiceNo(booking.getServiceNo() != null ? booking.getServiceNo() : "FX-101");
        
        if (booking.getUser() != null) {
            dto.setUserId(booking.getUser().getUserId());
        }
        if (booking.getRoute() != null) {
            dto.setRouteId(booking.getRoute().getRouteId());
        }

        return dto;
    }

    public static Booking toEntity(BookingDTO dto){

        Booking booking = new Booking();

        booking.setBookingId(dto.getBookingId());
        booking.setTotalAmount(dto.getTotalAmount());
        booking.setBookingStatus(dto.getBookingStatus());
        booking.setBookingDate(dto.getBookingDate());
        booking.setJourneyDate(dto.getJourneyDate());
        booking.setFare(dto.getFare());
        
        booking.setTicketNo(dto.getTicketNo());
        booking.setRouteName(dto.getRouteName());
        booking.setBusOperator(dto.getBusOperator());
        booking.setDepartureTime(dto.getDepartureTime());
        booking.setSeatNumbers(dto.getSeatNumbers());
        booking.setServiceNo(dto.getServiceNo());
        
        if (dto.getUserId() > 0) {
            com.hexaware.BusTicketBookingSystemFastX.entity.User user = new com.hexaware.BusTicketBookingSystemFastX.entity.User();
            user.setUserId(dto.getUserId());
            booking.setUser(user);
        }
        if (dto.getRouteId() > 0) {
            com.hexaware.BusTicketBookingSystemFastX.entity.Route route = new com.hexaware.BusTicketBookingSystemFastX.entity.Route();
            route.setRouteId(dto.getRouteId());
            booking.setRoute(route);
        }

        return booking;
    }
}