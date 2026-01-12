package com.company.cpms_backend.auth.service;

import com.company.cpms_backend.auth.dto.AuthResponse;
import com.company.cpms_backend.auth.dto.CompanyRegisterRequest;
import com.company.cpms_backend.auth.dto.CustomerRegisterRequest;
import com.company.cpms_backend.auth.dto.LoginRequest;
import com.company.cpms_backend.config.JwtUtil;
import com.company.cpms_backend.enums.Role;
import com.company.cpms_backend.user.dto.UserResponseDTO;
import com.company.cpms_backend.user.model.UserModel;
import com.company.cpms_backend.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepo,
                       PasswordEncoder encoder,
                       JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    public UserResponseDTO registerCustomer(CustomerRegisterRequest dto) {
        if (userRepo.existsByEmail(dto.getEmail()))
            throw new RuntimeException("Email already exists");

        UserModel user = new UserModel();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(encoder.encode(dto.getPassword()));
        user.setRole(Role.CUSTOMER);
        user.setContactNumber(dto.getContactNumber());
        user.setAddress(dto.getAddress());
        user.setGender(dto.getGender());
        user.setSalary(dto.getSalary()); // Added salary field

        UserModel savedUser = userRepo.save(user);

        return new UserResponseDTO(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getGender(),
                savedUser.getContactNumber(),
                savedUser.getAddress(),
                savedUser.getSalary(),
                savedUser.getCreatedAt()
        );
    }

    public UserResponseDTO registerCompanyUser(CompanyRegisterRequest dto, Role creatorRole) {

        if (userRepo.existsByEmail(dto.getEmail()))
            throw new RuntimeException("Email already exists");

        if (dto.getRole() == Role.CUSTOMER)
            throw new RuntimeException("Invalid role for company registration");

        if (dto.getRole() == Role.ADMIN && creatorRole != Role.SUPERADMIN)
            throw new RuntimeException("Only SUPERADMIN can create ADMIN");

        UserModel user = new UserModel();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(encoder.encode(dto.getPassword()));
        user.setRole(dto.getRole());
        user.setContactNumber(dto.getContactNumber());
        user.setAddress(dto.getAddress());
        user.setGender(dto.getGender());
        user.setSalary(dto.getSalary()); // Added salary field

        UserModel savedUser = userRepo.save(user);

        return new UserResponseDTO(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getGender(),
                savedUser.getContactNumber(),
                savedUser.getAddress(),
                savedUser.getSalary(),
                savedUser.getCreatedAt()
        );
    }

    public AuthResponse login(LoginRequest dto) {
        UserModel user = userRepo.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!encoder.matches(dto.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid credentials");

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponse(token, user.getRole().name(), user.getEmail());
    }
}
