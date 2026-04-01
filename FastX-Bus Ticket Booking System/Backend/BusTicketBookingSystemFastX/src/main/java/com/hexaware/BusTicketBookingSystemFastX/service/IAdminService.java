package com.hexaware.BusTicketBookingSystemFastX.service;

import java.util.List;
import com.hexaware.BusTicketBookingSystemFastX.dto.AdminDTO;

public interface IAdminService {

    AdminDTO addAdmin(AdminDTO dto);

    AdminDTO getAdminById(int id);

    List<AdminDTO> getAllAdmins();

}
