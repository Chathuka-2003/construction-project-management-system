//package com.company.cpms_backend.auth.controller;
//
//import com.company.cpms_backend.auth.dto.CompanyRegisterRequest;
//import com.company.cpms_backend.auth.service.AuthService;
//import com.company.cpms_backend.common.response.ApiResponse;
//import com.company.cpms_backend.enums.Role;
//import com.company.cpms_backend.user.dto.UserResponseDTO;
//import jakarta.validation.Valid;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.security.core.Authentication;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/admin")
//@PreAuthorize("hasAnyRole('SUPERADMIN','ADMIN')")
//public class AdminUserController {
//
//    private final AuthService authService;
//
//    public AdminUserController(AuthService authService) {
//        this.authService = authService;
//    }
//
//    @PostMapping("/register/user")
//    public ResponseEntity<ApiResponse<UserResponseDTO>> registerCompanyUser(
//            @RequestBody @Valid CompanyRegisterRequest dto,
//            Authentication authentication) {
//
//        String roleName = authentication.getAuthorities()
//                .iterator()
//                .next()
//                .getAuthority();
//        Role creatorRole = Role.valueOf(roleName.replace("ROLE_", ""));
//
//        UserResponseDTO user = authService.registerCompanyUser(dto, creatorRole);
//
//        ApiResponse<UserResponseDTO> response = new ApiResponse<>(
//                true,
//                "Company user created successfully",
//                user
//        );
//
//        return ResponseEntity.status(HttpStatus.CREATED).body(response);
//    }
//}

package com.company.cpms_backend.auth.controller;

import com.company.cpms_backend.auth.dto.CompanyRegisterRequest;
import com.company.cpms_backend.auth.service.AuthService;
import com.company.cpms_backend.user.dto.UserResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminUserController {

    private final AuthService authService;

    public AdminUserController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register/user")
    @PreAuthorize("hasAnyRole('SUPERADMIN', 'ADMIN')")
    public ResponseEntity<UserResponseDTO> registerCompanyUser(
            @RequestBody @Valid CompanyRegisterRequest dto,
            Authentication authentication) {

        String roleName = authentication.getAuthorities().iterator().next().getAuthority();

        // Remove "ROLE_" prefix if it exists
        if (roleName.startsWith("ROLE_")) {
            roleName = roleName.substring(5);
        }

        com.company.cpms_backend.enums.Role creatorRole =
                com.company.cpms_backend.enums.Role.valueOf(roleName);

        UserResponseDTO user = authService.registerCompanyUser(dto, creatorRole);

        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }
}
