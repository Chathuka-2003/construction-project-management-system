package com.company.cpms_backend.user.service;

import com.company.cpms_backend.enums.UserStatus;
import com.company.cpms_backend.user.dto.UserDTO;
import com.company.cpms_backend.user.dto.UserResponseDTO;
import com.company.cpms_backend.user.dto.UserUpdateDTO;

import java.util.List;

public interface UserService {

    UserResponseDTO saveUser(UserDTO dto);

    UserResponseDTO updateUser(Long id, UserDTO dto);

    void deleteUser(Long id);

    List<UserResponseDTO> getAllUsers();

    UserResponseDTO getUserById(Long id);

    UserResponseDTO updateStatus(Long id, UserStatus status);

    void changePassword(Long id, String currentPassword, String newPassword);

    UserResponseDTO updateUser(Long id, UserUpdateDTO dto);
}
