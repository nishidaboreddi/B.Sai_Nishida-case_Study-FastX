package com.hexaware.BusTicketBookingSystemFastX.security;

import com.hexaware.BusTicketBookingSystemFastX.entity.Admin;
import com.hexaware.BusTicketBookingSystemFastX.entity.BusOperator;
import com.hexaware.BusTicketBookingSystemFastX.entity.User;
import com.hexaware.BusTicketBookingSystemFastX.repository.IAdminRepository;
import com.hexaware.BusTicketBookingSystemFastX.repository.IBusOperatorRepository;
import com.hexaware.BusTicketBookingSystemFastX.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IBusOperatorRepository operatorRepository;

    @Autowired
    private IAdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        
        // 1. Check Admins (Highest Priority)
        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            return new org.springframework.security.core.userdetails.User(
                    admin.get().getEmail(),
                    admin.get().getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
        }

        // 2. Check Bus Operators
        Optional<BusOperator> operator = operatorRepository.findByEmail(email);
        if (operator.isPresent()) {
            return new org.springframework.security.core.userdetails.User(
                    operator.get().getEmail(),
                    operator.get().getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_OPERATOR"))
            );
        }

        // 3. Check Users
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            return new org.springframework.security.core.userdetails.User(
                    user.get().getEmail(),
                    user.get().getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
            );
        }

        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}
