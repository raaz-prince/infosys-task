package com.taskmanagement.entity;

import java.time.LocalDateTime;

import com.taskmanagement.auth.entities.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "activity_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@Column(name = "task_id")
	private Long taskId;
	
	@NotNull(message = "Actor is required")
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "actor_id", nullable = false)
	private User actor;
	
	@NotNull
	@Enumerated(EnumType.STRING)
	@Column(name = "action_code", nullable = false, length = 50)
	private ActionCode actionCode;
	
	@NotBlank(message = "message is required")
	@Column(name = "message", nullable = false, length = 500)
	private String message;
	
	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;
}
