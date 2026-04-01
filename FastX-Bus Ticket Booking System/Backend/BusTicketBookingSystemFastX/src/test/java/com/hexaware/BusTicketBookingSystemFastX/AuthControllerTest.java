package com.hexaware.BusTicketBookingSystemFastX;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hexaware.BusTicketBookingSystemFastX.dto.AuthRequest;
import com.hexaware.BusTicketBookingSystemFastX.dto.UserDTO;
import com.hexaware.BusTicketBookingSystemFastX.repository.IUserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private IUserRepository userRepository;

    @Test
    void testRegisterAndLogin() throws Exception {
        // Clean up previous test data if any
        userRepository.findByEmail("testuser@example.com").ifPresent(u -> userRepository.delete(u));

        UserDTO user = new UserDTO();
        user.setFirstName("Test");
        user.setLastName("User");
        user.setEmail("testuser@example.com");
        user.setPhone("1234567890");
        user.setPassword("password123");
        user.setGender("Male");
        user.setAddress("Test Address");

        // Register
        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk());

        // Login
        AuthRequest authRequest = new AuthRequest("testuser@example.com", "password123");
        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isOk());
    }
}
