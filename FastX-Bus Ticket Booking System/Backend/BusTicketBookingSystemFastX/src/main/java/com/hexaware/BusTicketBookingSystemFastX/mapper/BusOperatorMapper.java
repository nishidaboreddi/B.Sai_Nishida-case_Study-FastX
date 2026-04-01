package com.hexaware.BusTicketBookingSystemFastX.mapper;

import com.hexaware.BusTicketBookingSystemFastX.dto.BusOperatorDTO;
import com.hexaware.BusTicketBookingSystemFastX.entity.BusOperator;

public class BusOperatorMapper {

    public static BusOperatorDTO toDTO(BusOperator operator){

        BusOperatorDTO dto = new BusOperatorDTO();

        dto.setOperatorId(operator.getOperatorId());
        dto.setCompanyName(operator.getCompanyName());
        dto.setEmail(operator.getEmail());
        dto.setPhone(operator.getPhone());
        dto.setPassword(operator.getPassword());
        dto.setContactPersonName(operator.getContactPersonName());
        dto.setAddress(operator.getAddress());

        return dto;
    }

    public static BusOperator toEntity(BusOperatorDTO dto){

        BusOperator operator = new BusOperator();

        operator.setOperatorId(dto.getOperatorId());
        operator.setCompanyName(dto.getCompanyName());
        operator.setEmail(dto.getEmail());
        operator.setPhone(dto.getPhone());
        operator.setPassword(dto.getPassword());
        operator.setContactPersonName(dto.getContactPersonName());
        operator.setAddress(dto.getAddress());

        return operator;
    }
}