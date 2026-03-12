package com.taskmanagement.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CommentRequest {
	
	@NotNull(message = "Body is required")
	private String body;
}
