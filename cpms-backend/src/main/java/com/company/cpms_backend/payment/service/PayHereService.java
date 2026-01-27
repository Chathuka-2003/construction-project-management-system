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

        if (!mIdFromPayHere.equals(merchantId.trim())) {
            // ignore - not for this merchant
            return;
        }

        String localSig = payhereMd5Sig(
                mIdFromPayHere,
                orderId,
                payhereAmount,
                payhereCurrency,
                statusCode,
                merchantSecret.trim()
        );

        if (md5sig.isEmpty() || !localSig.equalsIgnoreCase(md5sig)) {
            // ignore invalid signature
            return;
        }

        Long paymentId;
        try {
            paymentId = Long.valueOf(orderId);
        } catch (Exception e) {
            return;
        }

        PaymentModel payment = paymentRepository.findById(paymentId).orElse(null);
        if (payment == null) return;

        payment.setGatewayPaymentId(safe(n.getPayment_id()));

        switch (statusCode) {
            case "2" -> {
                payment.setStatus(PaymentStatus.PAID);
                payment.setPaidDate(LocalDate.now());
            }
            case "0" -> payment.setStatus(PaymentStatus.PENDING);
            default -> payment.setStatus(PaymentStatus.FAILED);
        }

        paymentRepository.save(payment);
    }

    private static String safe(String s) {
        return s == null ? "" : s.trim();
    }

    private static String formatAmount(Double amount) {
        BigDecimal bd = BigDecimal.valueOf(amount == null ? 0.0 : amount)
                .setScale(2, RoundingMode.HALF_UP);
        return bd.toPlainString(); // e.g. 300.00
    }
