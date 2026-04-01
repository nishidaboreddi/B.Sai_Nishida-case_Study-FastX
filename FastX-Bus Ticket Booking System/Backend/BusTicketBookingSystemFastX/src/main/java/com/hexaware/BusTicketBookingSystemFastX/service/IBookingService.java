package com.hexaware.BusTicketBookingSystemFastX.service;

import java.util.List;
import com.hexaware.BusTicketBookingSystemFastX.dto.BookingDTO;

public interface IBookingService {

    BookingDTO addBooking(BookingDTO dto);

    BookingDTO getBookingById(int id);

    List<BookingDTO> getAllBookings();

    List<BookingDTO> getBookingsByUserId(int userId);

    BookingDTO getBookingByTicketNo(String ticketNo);

    void deleteBooking(int id);

    BookingDTO refundBooking(int id);
}