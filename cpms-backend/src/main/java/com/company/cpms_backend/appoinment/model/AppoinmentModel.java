package com.company.cpms_backend.appoinment.model;

import com.company.cpms_backend.enums.AppointmentStatus;
import com.company.cpms_backend.user.model.UserModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppoinmentModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private UserModel customer;

    @ManyToOne
    @JoinColumn(name = "handled_by")
    private UserModel handledBy;  // staff or admin

    private LocalDateTime appointmentDate;
    private String purpose;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    private LocalDateTime createdAt;
}
