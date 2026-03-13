package com.taskmanagement.auth.services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.taskmanagement.auth.dto.LoginResponse;
import com.taskmanagement.auth.dto.LoginRequest;
import com.taskmanagement.auth.dto.RegisterRequest;
import com.taskmanagement.auth.dto.RegisterResponse;
import com.taskmanagement.auth.entities.Role;
import com.taskmanagement.auth.entities.User;
import com.taskmanagement.auth.repositories.UserRepository;
import com.taskmanagement.auth.security.CustomUserDetails;
import com.taskmanagement.dto.UserDto;
import com.taskmanagement.exception.LoginFailedException;
import com.taskmanagement.exception.UserAlreadyExistsException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
	
	private final UserRepository userRepository;
	private final JwtService jwtService;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	
	public RegisterResponse register(RegisterRequest request) {

	    if (userRepository.existsByEmail(request.getEmail())) {
	        throw new UserAlreadyExistsException("Email already exists");
	    }

	    User user = User.builder()
	            .name(request.getName())
	            .email(request.getEmail())
	            .password(passwordEncoder.encode(request.getPassword()))
	            .role(Role.ROLE_USER)
	            .build();

	    userRepository.save(user);

	  
	    String message = "Account created successfully. Please login.";

	    return new RegisterResponse(message);
	}
	
	public LoginResponse login(LoginRequest request) {

	    try {
	        authenticationManager.authenticate(
	                new UsernamePasswordAuthenticationToken(
	                        request.getEmail(),
	                        request.getPassword()
	                )
	        );
	    } catch (BadCredentialsException ex) {
	        throw new LoginFailedException("Invalid email or password");
	    }

	    User user = userRepository.findByEmail(request.getEmail())
	            .orElseThrow(() ->
	                    new LoginFailedException("User not found"));

	    String token = jwtService.generateToken(
	            new CustomUserDetails(user)
	    );

	    return new LoginResponse(token, new UserDto(user.getId(), user.getName(), user.getEmail()));
	}
}
