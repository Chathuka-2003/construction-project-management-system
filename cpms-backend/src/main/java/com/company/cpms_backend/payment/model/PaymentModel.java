package com.company.cpms_backend.payment.model;

import com.company.cpms_backend.enums.PaymentStatus;
import com.company.cpms_backend.project.model.ProjectModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private LocalDate paidDate;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private ProjectModel project;
}
