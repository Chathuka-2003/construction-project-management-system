package com.company.cpms_backend.appointment.service;

import com.company.cpms_backend.appointment.dto.*;
import com.company.cpms_backend.appointment.model.AppointmentModel;
import com.company.cpms_backend.appointment.repository.AppointmentRepository;
import com.company.cpms_backend.enums.AppointmentStatus;
import com.company.cpms_backend.user.model.UserModel;
import com.company.cpms_backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    @Override
    public AppointmentResponseDTO createAppointment(AppointmentCreateDTO dto) {

        UserModel customer = userRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        UserModel handledBy = userRepository.findById(dto.getHandledById())
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        AppointmentModel appointment = new AppointmentModel();
        appointment.setCustomer(customer);
        appointment.setHandledBy(handledBy);
        appointment.setAppointmentDate(dto.getAppointmentDate());
        appointment.setPurpose(dto.getPurpose());
        appointment.setStatus(AppointmentStatus.REQUESTED);
        appointment.setCreatedAt(LocalDateTime.now());

        AppointmentModel saved = appointmentRepository.save(appointment);

        return mapToDTO(saved);
    }

    @Override
    public AppointmentResponseDTO updateStatus(Long id, AppointmentUpdateDTO dto) {

        AppointmentModel appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(dto.getStatus());

        return mapToDTO(appointmentRepository.save(appointment));
    }

    @Override
    public List<AppointmentResponseDTO> getAllAppointments() {
        return appointmentRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponseDTO> getAppointmentsByCustomer(Long customerId) {
        return appointmentRepository.findByCustomer_Id(customerId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponseDTO> getAppointmentsByStaff(Long staffId) {
        return appointmentRepository.findByHandledBy_Id(staffId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    private AppointmentResponseDTO mapToDTO(AppointmentModel a) {
        return AppointmentResponseDTO.builder()
                .id(a.getId())
                .customerId(a.getCustomer().getId())
                .customerName(a.getCustomer().getName())
                .handledById(a.getHandledBy().getId())
                .handledByName(a.getHandledBy().getName())
                .appointmentDate(a.getAppointmentDate())
                .purpose(a.getPurpose())
                .status(a.getStatus())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
