package com.hexaware.BusTicketBookingSystemFastX;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.client.RestTemplate;

import com.hexaware.BusTicketBookingSystemFastX.dto.PaymentDTO;

@SpringBootTest

public class PaymentControllerTest {

    RestTemplate restTemplate = new RestTemplate();

    String baseURL = "http://localhost:8080/api/payments";

    @Test
    void testMakePayment() {

        PaymentDTO payment = new PaymentDTO();

        payment.setPaymentMethod("UPI");
        payment.setPaymentStatus("SUCCESS");

        PaymentDTO response = restTemplate.postForObject(baseURL + "/add", payment, PaymentDTO.class);

        assertNotNull(response);

    }

}