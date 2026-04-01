package com.hexaware.BusTicketBookingSystemFastX.mapper;

import com.hexaware.BusTicketBookingSystemFastX.dto.AdminDTO;
import com.hexaware.BusTicketBookingSystemFastX.entity.Admin;

public class AdminMapper {

    public static AdminDTO toDTO(Admin admin){

        AdminDTO dto = new AdminDTO();

        dto.setAdminId(admin.getAdminId());
        dto.setName(admin.getName());
        dto.setEmail(admin.getEmail());
        dto.setPassword(admin.getPassword());

        return dto;
    }

    public static Admin toEntity(AdminDTO dto){

        Admin admin = new Admin();

        admin.setAdminId(dto.getAdminId());
        admin.setName(dto.getName());
        admin.setEmail(dto.getEmail());
        admin.setPassword(dto.getPassword());

        return admin;
    }
}