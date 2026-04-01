package com.hexaware.BusTicketBookingSystemFastX;

import com.hexaware.BusTicketBookingSystemFastX.dto.RouteDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.security.test.context.support.WithMockUser;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class RouteControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetAllRoutes() {
        RouteDTO[] response = restTemplate.getForObject("/api/v1/routes/getall", RouteDTO[].class);
        assertNotNull(response);
    }
}