package com.hexaware.BusTicketBookingSystemFastX.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.hexaware.BusTicketBookingSystemFastX.dto.BusDTO;
import com.hexaware.BusTicketBookingSystemFastX.entity.Bus;
import com.hexaware.BusTicketBookingSystemFastX.entity.BusOperator;
import com.hexaware.BusTicketBookingSystemFastX.mapper.BusMapper;
import com.hexaware.BusTicketBookingSystemFastX.repository.IBusOperatorRepository;
import com.hexaware.BusTicketBookingSystemFastX.repository.IBusRepository;

@Service
@Transactional
public class BusServiceImpl implements IBusService {

    @Autowired
    private IBusRepository repo;

    @Autowired
    private IBusOperatorRepository operatorRepo;

    @Override
    public BusDTO addBus(BusDTO dto) {

        Bus bus = BusMapper.toEntity(dto);

        if (dto.getOperatorId() != 0) {
            BusOperator operator = operatorRepo.findById(dto.getOperatorId())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Operator not found with ID: " + dto.getOperatorId() + ". Please register the operator first."
                ));
            bus.setOperator(operator);
        } else {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Operator ID is required to register a bus."
            );
        }

        bus = repo.save(bus);

        return BusMapper.toDTO(bus);
    }

    @Override
    public BusDTO updateBus(BusDTO dto) {

        Bus bus = BusMapper.toEntity(dto);

        if(dto.getOperatorId() != 0) {
            BusOperator operator = operatorRepo.findById(dto.getOperatorId()).orElse(null);
            bus.setOperator(operator);
        }

        bus = repo.save(bus);

        return BusMapper.toDTO(bus);
    }

    @Override
    public BusDTO getBusById(int id) {

        Bus bus = repo.findById(id).orElse(null);

        return BusMapper.toDTO(bus);
    }

    @Override
    public List<BusDTO> getAllBus() {

        List<Bus> buses = repo.findAll();

        return buses.stream()
                .map(BusMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteBus(int id) {
        repo.deleteById(id);
    }

}