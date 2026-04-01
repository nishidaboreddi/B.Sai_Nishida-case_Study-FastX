package com.hexaware.BusTicketBookingSystemFastX.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import com.hexaware.BusTicketBookingSystemFastX.dto.BusOperatorDTO;
import com.hexaware.BusTicketBookingSystemFastX.entity.BusOperator;
import com.hexaware.BusTicketBookingSystemFastX.mapper.BusOperatorMapper;
import com.hexaware.BusTicketBookingSystemFastX.repository.IBusOperatorRepository;

@Service
@Transactional
public class BusOperatorServiceImpl implements IBusOperatorService {

    @Autowired
    private IBusOperatorRepository repo;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    public BusOperatorDTO addOperator(BusOperatorDTO dto) {
        if (repo.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Operator already exists with this email: " + dto.getEmail());
        }

        BusOperator operator = BusOperatorMapper.toEntity(dto);
        operator.setPassword(passwordEncoder.encode(operator.getPassword()));
        operator = repo.save(operator);

        return BusOperatorMapper.toDTO(operator);
    }

    @Override
    public BusOperatorDTO getOperatorById(int id) {

        BusOperator operator = repo.findById(id).orElse(null);

        return BusOperatorMapper.toDTO(operator);
    }

    @Override
    public List<BusOperatorDTO> getAllOperators() {

        List<BusOperator> operators = repo.findAll();

        return operators.stream()
                .map(BusOperatorMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteOperator(int id) {
        repo.deleteById(id);
    }

}