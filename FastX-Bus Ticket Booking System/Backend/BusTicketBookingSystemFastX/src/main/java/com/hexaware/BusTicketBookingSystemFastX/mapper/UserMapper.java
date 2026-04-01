package com.hexaware.BusTicketBookingSystemFastX.mapper;

import com.hexaware.BusTicketBookingSystemFastX.dto.UserDTO;
import com.hexaware.BusTicketBookingSystemFastX.entity.User;

public class UserMapper {

    public static UserDTO toDTO(User user) {

        if(user == null) return null;

        UserDTO dto = new UserDTO();

        dto.setUserId(user.getUserId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setPassword(user.getPassword());
        dto.setGender(user.getGender());
        dto.setAddress(user.getAddress());

        return dto;
    }

    public static User toEntity(UserDTO dto) {

        if(dto == null) return null;

        User user = new User();

        user.setUserId(dto.getUserId());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setPassword(dto.getPassword());
        user.setGender(dto.getGender());
        user.setAddress(dto.getAddress());

        return user;
    }
}