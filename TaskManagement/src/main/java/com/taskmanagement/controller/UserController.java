package com.taskmanagement.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskmanagement.auth.repositories.UserRepository;
import com.taskmanagement.dto.UserDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
	
	private final UserRepository userRepository;
	
	@GetMapping
	public List<UserDto> getAllUsers(Principal principal){
		return userRepository.findAll()
				.stream()
				.filter(user -> !user.getEmail().equals(principal.getName()))
				.map(user -> new UserDto(user.getId(), user.getName()))
				.toList();
	}
}
