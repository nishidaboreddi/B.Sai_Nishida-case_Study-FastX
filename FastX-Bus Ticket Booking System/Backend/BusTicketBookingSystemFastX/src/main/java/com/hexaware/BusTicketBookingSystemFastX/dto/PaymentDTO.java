package com.hexaware.BusTicketBookingSystemFastX.dto;

public class PaymentDTO {

    private int paymentId;
    private int bookingId;
    private String paymentMethod;
    private String paymentStatus;

    public PaymentDTO() {}

    public PaymentDTO(int paymentId, int bookingId,
                      String paymentMethod, String paymentStatus) {
        this.paymentId = paymentId;
        this.bookingId = bookingId;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
    }

    public int getPaymentId() { return paymentId; }

    public void setPaymentId(int paymentId) { this.paymentId = paymentId; }

    public int getBookingId() { return bookingId; }

    public void setBookingId(int bookingId) { this.bookingId = bookingId; }

    public String getPaymentMethod() { return paymentMethod; }

    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentStatus() { return paymentStatus; }

    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

}