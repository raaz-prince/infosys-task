package com.taskmanagement.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.taskmanagement.dto.TaskRequest;
import com.taskmanagement.dto.TaskResponse;
import com.taskmanagement.dto.UpdateTaskRequest;
import com.taskmanagement.entity.Status;
import com.taskmanagement.service.TaskService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/tasks")
@RequiredArgsConstructor
public class TaskController {

	private final TaskService taskService;

	@GetMapping("/")
	public ResponseEntity<?> hello() {
		return ResponseEntity.ok("role based checking");
	}

	@PostMapping("/add-task")
	public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody @NotNull TaskRequest request,
			Principal principal) {
		return new ResponseEntity<TaskResponse>(taskService.addTask(request, principal.getName()), HttpStatus.CREATED);
	}

	@GetMapping("/get-tasks")
	public ResponseEntity<List<TaskResponse>> getAllTasks(Principal principal) {
		return ResponseEntity.ok(taskService.getAllTasks(principal.getName()));
	}

	@DeleteMapping("/delete-task/{id}")
	public ResponseEntity<Void> deleteTask(@PathVariable Long id, Principal principal) {
		taskService.deleteTask(id, principal.getName());
		return ResponseEntity.noContent().build();
	}

	@PutMapping("/update-status/{id}")
	public ResponseEntity<TaskResponse> updateStatus(@PathVariable Long id, @RequestParam Status status,
			Principal principal) {
		return ResponseEntity.ok(taskService.updateTaskStatus(id, status, principal.getName()));
	}

	@PutMapping("/update-task/{id}")
	public ResponseEntity<TaskResponse> updateTask(
			@PathVariable Long id,
			@Valid @RequestBody UpdateTaskRequest task,
			Principal principal
			) {
		return ResponseEntity.ok(taskService.updateTask(id, task, principal.getName()));
	}
}
