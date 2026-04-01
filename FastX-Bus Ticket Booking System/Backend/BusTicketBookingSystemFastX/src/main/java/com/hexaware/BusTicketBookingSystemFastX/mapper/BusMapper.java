package com.hexaware.BusTicketBookingSystemFastX.mapper;

import com.hexaware.BusTicketBookingSystemFastX.dto.BusDTO;
import com.hexaware.BusTicketBookingSystemFastX.entity.Bus;

public class BusMapper {

    public static BusDTO toDTO(Bus bus){

        BusDTO dto = new BusDTO();

        dto.setBusId(bus.getBusId());
        dto.setBusName(bus.getBusName());
        dto.setBusNumber(bus.getBusNumber());
        dto.setBusType(bus.getBusType());
        dto.setTotalSeats(bus.getTotalSeats());
        dto.setServiceNumber(bus.getServiceNumber());
        if(bus.getOperator() != null) {
            dto.setOperatorId(bus.getOperator().getOperatorId());
        }

        return dto;
    }

    public static Bus toEntity(BusDTO dto){

        Bus bus = new Bus();

        bus.setBusId(dto.getBusId());
        bus.setBusName(dto.getBusName());
        bus.setBusNumber(dto.getBusNumber());
        bus.setBusType(dto.getBusType());
        bus.setTotalSeats(dto.getTotalSeats());
        bus.setServiceNumber(dto.getServiceNumber());

        return bus;
    }
}