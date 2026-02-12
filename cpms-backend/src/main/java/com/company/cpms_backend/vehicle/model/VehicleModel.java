package com.company.cpms_backend.vehicle.model;

import com.company.cpms_backend.enums.VehicleCondition;
import com.company.cpms_backend.enums.VehicleStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String regNumber;

    @Column(name = "vehicle_type")
    private String type;

    private String fuel;
    private String capacity;
    private String machine;

    @Column(name = "vehicle_condition")
    @Enumerated(EnumType.STRING)
    private VehicleCondition condition;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleStatus status;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (status == null) status = VehicleStatus.AVAILABLE;
        if (condition == null) condition = VehicleCondition.GOOD;
    }
}
