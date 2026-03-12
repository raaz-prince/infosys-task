package com.taskmanagement.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
	
	@Email(message = "provide correct email")
	@NotNull(message = "email can't be empty")
	private String email;
	
	@NotNull(message = "password can't be empty")
	@Size(min = 8, message = "password should be atleast 8 digits long")
	private String password;
}
