package com.company.cpms_backend.appointment.repository;

import com.company.cpms_backend.appointment.model.AppointmentModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<AppointmentModel, Long> {

    List<AppointmentModel> findByCustomer_Id(Long customerId);

    List<AppointmentModel> findByHandledBy_Id(Long staffId);
}
