package com.company.cpms_backend.appointment.service;

import com.company.cpms_backend.appointment.dto.*;

import java.util.List;

public interface AppointmentService {

    AppointmentResponseDTO createAppointment(AppointmentCreateDTO dto);

    AppointmentResponseDTO updateStatus(Long id, AppointmentUpdateDTO dto);

    List<AppointmentResponseDTO> getAllAppointments();

    List<AppointmentResponseDTO> getAppointmentsByCustomer(Long customerId);

    List<AppointmentResponseDTO> getAppointmentsByStaff(Long staffId);

    void deleteAppointment(Long id);
}
