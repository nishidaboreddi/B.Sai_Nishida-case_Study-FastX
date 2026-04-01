package com.hexaware.BusTicketBookingSystemFastX.service;

import java.util.List;
import com.hexaware.BusTicketBookingSystemFastX.dto.UserDTO;

public interface IUserService {

    UserDTO addUser(UserDTO dto);

    UserDTO updateUser(UserDTO dto);

    UserDTO getUserById(int id);

    List<UserDTO> getAllUsers();

    void deleteUser(int id);

}