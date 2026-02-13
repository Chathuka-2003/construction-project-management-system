package com.company.cpms_backend.user.service.impl;

import com.company.cpms_backend.enums.UserStatus;
import com.company.cpms_backend.user.dto.UserDTO;
import com.company.cpms_backend.user.dto.UserResponseDTO;
import com.company.cpms_backend.user.dto.UserUpdateDTO;
import com.company.cpms_backend.user.model.UserModel;
import com.company.cpms_backend.user.repository.UserRepository;
import com.company.cpms_backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponseDTO saveUser(UserDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists: " + dto.getEmail());
        }

        UserModel user = new UserModel();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword()); // TODO: hash with BCrypt in production
        user.setRole(dto.getRole());
        user.setContactNumber(dto.getContactNumber());
        user.setAddress(dto.getAddress());
        user.setGender(dto.getGender());
        user.setSalary(dto.getSalary());

        // ✅ REQUIRED NOW
        user.setStatus(dto.getStatus());

        UserModel savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    @Override
    public UserResponseDTO updateUser(Long id, UserDTO dto) {
        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (!user.getEmail().equals(dto.getEmail()) && userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists: " + dto.getEmail());
        }

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(dto.getPassword()); // TODO: hash with BCrypt
        }

        user.setRole(dto.getRole());
        user.setContactNumber(dto.getContactNumber());
        user.setAddress(dto.getAddress());
        user.setGender(dto.getGender());
        user.setSalary(dto.getSalary());

        // ✅ REQUIRED NOW
        user.setStatus(dto.getStatus());

        UserModel updated = userRepository.save(user);
        return mapToResponse(updated);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO getUserById(Long id) {
        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return mapToResponse(user);
    }

    private UserResponseDTO mapToResponse(UserModel user) {
        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getGender(),
                user.getContactNumber(),
                user.getAddress(),
                user.getSalary(),
                user.getStatus(),
                user.getCreatedAt()
        );
    }

    public UserResponseDTO updateStatus(Long id, UserStatus status) {
        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(status);
        UserModel saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    @Override
    public void changePassword(Long id, String currentPassword, String newPassword) {
        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }


    @Override
    public UserResponseDTO updateUser(Long id, UserUpdateDTO dto) {

        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (!user.getEmail().equalsIgnoreCase(dto.getEmail())
                && userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists: " + dto.getEmail());
        }

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());
        user.setContactNumber(dto.getContactNumber());
        user.setAddress(dto.getAddress());
        user.setGender(dto.getGender());
        user.setSalary(dto.getSalary());
        user.setStatus(dto.getStatus());

        UserModel updated = userRepository.save(user);
        return mapToResponse(updated);
    }
}
