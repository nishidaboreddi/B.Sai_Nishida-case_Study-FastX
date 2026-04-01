package com.hexaware.BusTicketBookingSystemFastX.service;

import java.util.List;
import com.hexaware.BusTicketBookingSystemFastX.dto.BusDTO;

public interface IBusService {

    BusDTO addBus(BusDTO dto);

    BusDTO updateBus(BusDTO dto);

    BusDTO getBusById(int id);

    List<BusDTO> getAllBus();

    void deleteBus(int id);

}