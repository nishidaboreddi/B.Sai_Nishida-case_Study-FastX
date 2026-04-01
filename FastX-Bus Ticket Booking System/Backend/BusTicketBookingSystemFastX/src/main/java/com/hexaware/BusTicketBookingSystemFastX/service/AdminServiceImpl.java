package com.hexaware.BusTicketBookingSystemFastX.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.BusTicketBookingSystemFastX.dto.AdminDTO;
import com.hexaware.BusTicketBookingSystemFastX.entity.Admin;
import com.hexaware.BusTicketBookingSystemFastX.mapper.AdminMapper;
import com.hexaware.BusTicketBookingSystemFastX.repository.IAdminRepository;

@Service
public class AdminServiceImpl implements IAdminService {

    @Autowired
    private IAdminRepository repo;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    public AdminDTO addAdmin(AdminDTO dto) {

        Admin admin = AdminMapper.toEntity(dto);
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        admin = repo.save(admin);

        return AdminMapper.toDTO(admin);
    }

    @Override
    public AdminDTO getAdminById(int id) {

        Admin admin = repo.findById(id).orElse(null);

        return AdminMapper.toDTO(admin);
    }

    @Override
    public List<AdminDTO> getAllAdmins() {

        List<Admin> admins = repo.findAll();

        return admins.stream()
                .map(AdminMapper::toDTO)
                .collect(Collectors.toList());
    }

}
