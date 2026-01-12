package com.company.cpms_backend.user.service.impl;

import com.company.cpms_backend.user.dto.UserDTO;
import com.company.cpms_backend.user.dto.UserResponseDTO;
import com.company.cpms_backend.user.model.UserModel;
import com.company.cpms_backend.user.repository.UserRepository;
import com.company.cpms_backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserResponseDTO saveUser(UserDTO dto) {
        // Check if email already exists
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists: " + dto.getEmail());
        }

        UserModel user = new UserModel();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword()); // TODO: In production, hash the password using BCrypt
        user.setRole(dto.getRole());
        user.setContactNumber(dto.getContactNumber());
        user.setAddress(dto.getAddress());
        user.setGender(dto.getGender());
        user.setSalary(dto.getSalary());
        // createdAt is automatically set by @CreationTimestamp

        UserModel savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    @Override
    public UserResponseDTO updateUser(Long id, UserDTO dto) {
        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Check if email is being changed and if new email already exists
        if (!user.getEmail().equals(dto.getEmail()) &&
                userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists: " + dto.getEmail());
        }

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        // Only update password if it's provided and different
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(dto.getPassword()); // TODO: Hash the password
        }
        user.setRole(dto.getRole());
        user.setContactNumber(dto.getContactNumber());
        user.setAddress(dto.getAddress());
        user.setGender(dto.getGender());
        user.setSalary(dto.getSalary());
        // createdAt should not be updated

        UserModel updatedUser = userRepository.save(user);
        return mapToResponse(updatedUser);
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
                user.getCreatedAt()
        );
    }
}