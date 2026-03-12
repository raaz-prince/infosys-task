package com.taskmanagement.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponse {
	private Long id;
	private String title;
	private String description;
	private String status;
	private LocalDate createdAt;
	private LocalDate dueDate;
	private LocalDate updatedAt;
	private UserDto assignee;
	private String priority;
}
