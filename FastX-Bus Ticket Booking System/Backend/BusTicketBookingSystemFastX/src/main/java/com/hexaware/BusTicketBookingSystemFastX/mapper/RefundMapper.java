package com.hexaware.BusTicketBookingSystemFastX.mapper;

import com.hexaware.BusTicketBookingSystemFastX.dto.RefundDTO;
import com.hexaware.BusTicketBookingSystemFastX.entity.Refund;

public class RefundMapper {

    public static RefundDTO toDTO(Refund refund){

        RefundDTO dto = new RefundDTO();

        dto.setRefundId(refund.getRefundId());
        dto.setRefundAmount(refund.getRefundAmount());

        return dto;
    }

    public static Refund toEntity(RefundDTO dto){

        Refund refund = new Refund();

        refund.setRefundId(dto.getRefundId());
        refund.setRefundAmount(dto.getRefundAmount());

        return refund;
    }
}