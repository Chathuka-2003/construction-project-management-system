package com.company.cpms_backend.payment.service;

import com.company.cpms_backend.enums.PaymentStatus;
import com.company.cpms_backend.payment.dto.PayHereInitResponse;
import com.company.cpms_backend.payment.dto.PayHereNotifyRequest;
import com.company.cpms_backend.payment.model.PaymentModel;
import com.company.cpms_backend.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class PayHereService {

    private final PaymentRepository paymentRepository;

    @Value("${payhere.sandbox:true}")
    private boolean sandbox;

    @Value("${payhere.merchantId}")
    private String merchantId;

    @Value("${payhere.merchantSecret}")
    private String merchantSecret;

    @Value("${payhere.notifyUrl}")
    private String notifyUrl;

    @Value("${payhere.returnUrl}")
    private String returnUrl;

    @Value("${payhere.cancelUrl}")
    private String cancelUrl;

    public PayHereInitResponse buildInitPayload(Long paymentId, String customerEmail, String customerName) {

        PaymentModel payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        String mId = merchantId.trim();
        String secret = merchantSecret.trim();

        String orderId = payment.getId().toString();
        String currency = "LKR"; // keep fixed for sandbox + simplicity

        String amountStr = formatAmount(payment.getAmount()); // must be 2 decimals
        String hash = payhereHash(mId, orderId, amountStr, currency, secret);

        String firstName = (customerName == null || customerName.isBlank()) ? "Customer" : customerName.trim();
        String lastName = "";

        String invoice = (payment.getInvoiceNo() == null || payment.getInvoiceNo().isBlank())
                ? orderId
                : payment.getInvoiceNo().trim();

        return new PayHereInitResponse(
                sandbox,
                mId,
                returnUrl,
                cancelUrl,
                notifyUrl,
                orderId,
                "CPMS Invoice " + invoice,
                amountStr,
                currency,
                hash,
                firstName,
                lastName,
                customerEmail,
                "", "", "", "Sri Lanka"
        );
    }

    public void handleNotify(PayHereNotifyRequest n) {

        if (n == null) return;

        String mIdFromPayHere = safe(n.getMerchant_id());
        String orderId = safe(n.getOrder_id());
        String payhereAmount = safe(n.getPayhere_amount());
        String payhereCurrency = safe(n.getPayhere_currency());
        String statusCode = safe(n.getStatus_code());
        String md5sig = safe(n.getMd5sig());