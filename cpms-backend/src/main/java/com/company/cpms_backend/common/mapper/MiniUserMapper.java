package com.company.cpms_backend.common.mapper;

import com.company.cpms_backend.common.dto.UserMiniDTO;
import com.company.cpms_backend.user.model.UserModel;

public class MiniUserMapper {
    private MiniUserMapper(){}

    public static UserMiniDTO toMini(UserModel u) {
        if (u == null) return null;
        // role might be enum in your system; convert to string safely
        String role = (u.getRole() != null) ? String.valueOf(u.getRole()) : null;
        return new UserMiniDTO(u.getId(), u.getName(), u.getEmail(), role);
    }
}
