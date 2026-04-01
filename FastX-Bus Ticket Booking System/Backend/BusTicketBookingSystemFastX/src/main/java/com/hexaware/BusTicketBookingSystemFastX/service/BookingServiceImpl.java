package com.hexaware.BusTicketBookingSystemFastX.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.hexaware.BusTicketBookingSystemFastX.dto.BookingDTO;
import com.hexaware.BusTicketBookingSystemFastX.entity.Booking;
import com.hexaware.BusTicketBookingSystemFastX.mapper.BookingMapper;
import com.hexaware.BusTicketBookingSystemFastX.repository.IBookingRepository;

@Service
public class BookingServiceImpl implements IBookingService {

    @Autowired
    private IBookingRepository repo;

    @Override
    public BookingDTO addBooking(BookingDTO dto) {
        Booking booking = BookingMapper.toEntity(dto);
        booking = repo.save(booking);
        return BookingMapper.toDTO(booking);
    }

    @Override
    public BookingDTO getBookingById(int id) {
        Booking booking = repo.findById(id).orElse(null);
        return BookingMapper.toDTO(booking);
    }

    @Override
    public List<BookingDTO> getAllBookings() {
        List<Booking> bookings = repo.findAll();
        return bookings.stream()
                .map(BookingMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingDTO> getBookingsByUserId(int userId) {
        return repo.findByUser_UserId(userId).stream()
                   .map(BookingMapper::toDTO)
                   .collect(Collectors.toList());
    }

    @Override
    public BookingDTO getBookingByTicketNo(String ticketNo) {
        Booking booking = repo.findByTicketNo(ticketNo)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "No booking found for ticket number: " + ticketNo
            ));
        return BookingMapper.toDTO(booking);
    }

    @Override
    public void deleteBooking(int id) {
        repo.deleteById(id);
    }

    @Override
    public BookingDTO refundBooking(int id) {
        Booking booking = repo.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Booking not found with id: " + id
            ));
        if ("CONFIRMED".equalsIgnoreCase(booking.getBookingStatus())) {
            booking.setBookingStatus("CANCELLED");
        } else if ("CANCELLED".equalsIgnoreCase(booking.getBookingStatus())) {
            booking.setBookingStatus("REFUNDED");
        } else {
            booking.setBookingStatus("REFUNDED");
        }
        repo.save(booking);
        return BookingMapper.toDTO(booking);
    }
}