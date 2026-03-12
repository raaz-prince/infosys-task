package com.taskmanagement.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
	
	@Size(min = 3, message = "name's length should be more than 3")
	@NotNull(message = "name can't be empty")
	@Pattern(
			regexp = "^[A-Za-z]+( [a-zA-Z]+)*$",
			message = "only letters and single spaces are allowed")
	private String name;
	
	@NotNull(message = "Email can't be empty")
	@Email(message = "provide correct email")
	private String email;
	
	@NotNull(message = "password can't be empty")
	@Size(min = 8, message = "password should be minimum 8 digits long")
	private String password;
}
