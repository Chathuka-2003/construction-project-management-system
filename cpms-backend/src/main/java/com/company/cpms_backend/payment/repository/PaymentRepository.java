package com.company.cpms_backend.payment.repository;

import com.company.cpms_backend.payment.model.PaymentModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<PaymentModel, Long> {

    List<PaymentModel> findAllByProject_IdOrderByCreatedAtDesc(Long projectId);
