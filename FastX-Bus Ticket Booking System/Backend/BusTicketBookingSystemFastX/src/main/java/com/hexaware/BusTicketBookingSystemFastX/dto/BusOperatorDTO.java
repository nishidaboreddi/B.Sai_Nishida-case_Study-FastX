package com.hexaware.BusTicketBookingSystemFastX.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class BusOperatorDTO {

    private int operatorId;
    
    @NotBlank(message = "Company Name is required")
    @Pattern(regexp = "^[a-zA-Z\\s.-]+$", message = "Company Name must only contain alphabets, dots, or hyphens")
    private String companyName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10 digits")
    private String phone;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Contact Person Name is required")
    @Pattern(regexp = "^[a-zA-Z\\s.-]+$", message = "Contact Person Name must only contain alphabets, dots, or hyphens")
    private String contactPersonName;
    private String address;

    public BusOperatorDTO() {}

    public BusOperatorDTO(int operatorId, String companyName,
                          String email, String phone, String password, String contactPersonName, String address) {
        this.operatorId = operatorId;
        this.companyName = companyName;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.contactPersonName = contactPersonName;
        this.address = address;
    }

    public int getOperatorId() { return operatorId; }

    public void setOperatorId(int operatorId) { this.operatorId = operatorId; }

    public String getCompanyName() { return companyName; }

    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }

    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    public String getContactPersonName() { return contactPersonName; }

    public void setContactPersonName(String contactPersonName) { this.contactPersonName = contactPersonName; }

    public String getAddress() { return address; }

    public void setAddress(String address) { this.address = address; }

}