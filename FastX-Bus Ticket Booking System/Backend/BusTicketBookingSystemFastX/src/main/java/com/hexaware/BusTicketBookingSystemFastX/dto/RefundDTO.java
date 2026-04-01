package com.hexaware.BusTicketBookingSystemFastX.dto;

public class RefundDTO {

    private int refundId;
    private int bookingId;
    private double refundAmount;

    public RefundDTO() {}

    public RefundDTO(int refundId, int bookingId, double refundAmount) {
        this.refundId = refundId;
        this.bookingId = bookingId;
        this.refundAmount = refundAmount;
    }

    public int getRefundId() { return refundId; }

    public void setRefundId(int refundId) { this.refundId = refundId; }

    public int getBookingId() { return bookingId; }

    public void setBookingId(int bookingId) { this.bookingId = bookingId; }

    public double getRefundAmount() { return refundAmount; }

    public void setRefundAmount(double refundAmount) { this.refundAmount = refundAmount; }

}