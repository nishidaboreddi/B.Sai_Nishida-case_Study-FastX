package com.hexaware.BusTicketBookingSystemFastX;

import com.hexaware.BusTicketBookingSystemFastX.dto.BookingDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.security.test.context.support.WithMockUser;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class BookingControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetAllBookings() {
        BookingDTO[] response = restTemplate.getForObject("/api/v1/bookings/getall", BookingDTO[].class);
        assertNotNull(response);
    }
}