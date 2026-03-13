package com.taskmanagement.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ActivityDTO {
	private Long id;
	private String userInitials;
	private String message;
	private LocalDateTime createdAt;
}
