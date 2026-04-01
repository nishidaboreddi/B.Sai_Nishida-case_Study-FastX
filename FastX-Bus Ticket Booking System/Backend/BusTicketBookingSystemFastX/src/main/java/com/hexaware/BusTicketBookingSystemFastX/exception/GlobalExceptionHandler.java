package com.hexaware.BusTicketBookingSystemFastX.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.dao.DataIntegrityViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // User Exception
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserException(UserNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    // Bus Exception
    @ExceptionHandler(BusNotFoundException.class)
    public ResponseEntity<String> handleBusException(BusNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    // Booking Exception
    @ExceptionHandler(BookingNotFoundException.class)
    public ResponseEntity<String> handleBookingException(BookingNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    // Route Exception
    @ExceptionHandler(RouteNotFoundException.class)
    public ResponseEntity<String> handleRouteException(RouteNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    // Payment Exception
    @ExceptionHandler(PaymentNotFoundException.class)
    public ResponseEntity<String> handlePaymentException(PaymentNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    // Data Integrity Exception (e.g., FK constraint violations on delete)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        return new ResponseEntity<>(
            "Cannot delete: this record is referenced by other data (e.g., bookings or buses). Please remove associated records first.",
            HttpStatus.CONFLICT
        );
    }

    // Generic fallback Exception
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGenericException(Exception ex) {
        return new ResponseEntity<>(
            "An unexpected error occurred: " + ex.getMessage(),
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

}