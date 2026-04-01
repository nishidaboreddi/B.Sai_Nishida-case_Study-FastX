package com.hexaware.BusTicketBookingSystemFastX.controller;

import com.hexaware.BusTicketBookingSystemFastX.dto.AuthRequest;
import com.hexaware.BusTicketBookingSystemFastX.dto.AuthResponse;
import com.hexaware.BusTicketBookingSystemFastX.dto.UserDTO;
import com.hexaware.BusTicketBookingSystemFastX.security.JwtUtils;
import com.hexaware.BusTicketBookingSystemFastX.service.IUserService;
import com.hexaware.BusTicketBookingSystemFastX.repository.IAdminRepository;
import com.hexaware.BusTicketBookingSystemFastX.repository.IBusOperatorRepository;
import com.hexaware.BusTicketBookingSystemFastX.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private IUserService userService;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IBusOperatorRepository operatorRepository;

    @Autowired
    private IAdminRepository adminRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserDTO userDTO) {
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            return new ResponseEntity<>("Error: Email is already in use!", HttpStatus.CONFLICT);
        }
        userService.addUser(userDTO);
        return new ResponseEntity<>("User Registered Successfully", HttpStatus.OK);
    }

    @PostMapping("/login")
    public AuthResponse authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );
        if (authentication.isAuthenticated()) {
            String token = jwtUtils.generateToken(authRequest.getUsername());
            String role = authentication.getAuthorities().iterator().next().getAuthority();
            
            AuthResponse authResponse = new AuthResponse();
            authResponse.setToken(token);
            authResponse.setRole(role);
            
            if("ROLE_ADMIN".equals(role)) {
                adminRepository.findByEmail(authRequest.getUsername()).ifPresent(a -> {
                    authResponse.setName(a.getName());
                    authResponse.setId(a.getAdminId());
                });
            } else if("ROLE_OPERATOR".equals(role)) {
                operatorRepository.findByEmail(authRequest.getUsername()).ifPresent(o -> {
                    authResponse.setName(o.getCompanyName());
                    authResponse.setId(o.getOperatorId());
                });
            } else {
                userRepository.findByEmail(authRequest.getUsername()).ifPresent(u -> {
                    authResponse.setName(u.getFirstName());
                    authResponse.setId(u.getUserId());
                });
            }

            return authResponse;
        } else {
            throw new UsernameNotFoundException("invalid user request !");
        }
    }
}
