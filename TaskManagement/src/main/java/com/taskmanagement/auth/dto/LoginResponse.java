package com.taskmanagement.auth.dto;

import com.taskmanagement.dto.UserDto;

public record LoginResponse(String token, UserDto user) {
}
