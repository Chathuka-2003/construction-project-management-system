package com.company.cpms_backend.auth.controller;

import com.company.cpms_backend.auth.dto.AuthResponse;
import com.company.cpms_backend.auth.dto.CustomerRegisterRequest;
import com.company.cpms_backend.auth.dto.LoginRequest;
import com.company.cpms_backend.auth.service.AuthService;
import com.company.cpms_backend.common.response.ApiResponse;
import com.company.cpms_backend.user.dto.UserResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register/customer")
    public ResponseEntity<ApiResponse<UserResponseDTO>> registerCustomer(
            @RequestBody @Valid CustomerRegisterRequest dto) {

        UserResponseDTO user = authService.registerCustomer(dto);

        ApiResponse<UserResponseDTO> response = new ApiResponse<>(
                true,
                "Customer registered successfully",
                user
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @RequestBody @Valid LoginRequest dto) {

        AuthResponse auth = authService.login(dto);

        ApiResponse<AuthResponse> response = new ApiResponse<>(
                true,
                "Login successful",
                auth
        );

        return ResponseEntity.ok(response);
    }
}
