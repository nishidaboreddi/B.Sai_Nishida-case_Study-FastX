package com.hexaware.BusTicketBookingSystemFastX.entity;

import java.util.List;

import org.springframework.stereotype.Component;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="bus_operators")

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusOperator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int operatorId;

    @NotBlank(message = "Company Name is required")
    @Pattern(regexp = "^[a-zA-Z\\s.-]+$", message = "Company Name must only contain alphabets, dots, or hyphens")
    private String companyName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10 digits")
    private String phone;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @NotBlank(message = "Contact Person Name is required")
    @Pattern(regexp = "^[a-zA-Z\\s.-]+$", message = "Contact Person Name must only contain alphabets, dots, or hyphens")
    private String contactPersonName;

    private String address;

    @OneToMany(mappedBy="operator", cascade=CascadeType.ALL)
    private List<Bus> buses;

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