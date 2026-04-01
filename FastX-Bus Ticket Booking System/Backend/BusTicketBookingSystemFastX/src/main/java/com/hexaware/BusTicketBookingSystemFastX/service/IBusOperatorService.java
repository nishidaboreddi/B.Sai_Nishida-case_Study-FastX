package com.hexaware.BusTicketBookingSystemFastX.service;

import java.util.List;
import com.hexaware.BusTicketBookingSystemFastX.dto.BusOperatorDTO;

public interface IBusOperatorService {

    BusOperatorDTO addOperator(BusOperatorDTO dto);

    BusOperatorDTO getOperatorById(int id);

    List<BusOperatorDTO> getAllOperators();

    void deleteOperator(int id);

}