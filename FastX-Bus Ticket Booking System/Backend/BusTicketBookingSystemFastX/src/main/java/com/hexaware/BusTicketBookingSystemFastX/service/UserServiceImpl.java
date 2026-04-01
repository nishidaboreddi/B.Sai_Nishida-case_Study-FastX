package com.hexaware.BusTicketBookingSystemFastX.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.BusTicketBookingSystemFastX.dto.UserDTO;
import com.hexaware.BusTicketBookingSystemFastX.entity.User;
import com.hexaware.BusTicketBookingSystemFastX.mapper.UserMapper;
import com.hexaware.BusTicketBookingSystemFastX.repository.IUserRepository;

@Service
@Transactional
public class UserServiceImpl implements IUserService {

    @Autowired
    private IUserRepository repo;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    public UserDTO addUser(UserDTO dto) {

        User user = UserMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user = repo.save(user);

        return UserMapper.toDTO(user);
    }

    @Override
    public UserDTO updateUser(UserDTO dto) {

        User user = UserMapper.toEntity(dto);

        user = repo.save(user);

        return UserMapper.toDTO(user);
    }

    @Override
    public UserDTO getUserById(int id) {

        User user = repo.findById(id).orElse(null);

        return UserMapper.toDTO(user);
    }

    @Override
    public List<UserDTO> getAllUsers() {

        List<User> users = repo.findAll();

        return users.stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUser(int id) {
        repo.deleteById(id);
    }

}