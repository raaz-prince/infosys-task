package com.taskmanagement.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskmanagement.dto.CommentRequest;
import com.taskmanagement.dto.CommentResponse;
import com.taskmanagement.service.CommentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {
	
	private final CommentService commentService;
	
	@GetMapping("/tasks/{taskId}/comments")
	public ResponseEntity<List<CommentResponse>> getComments(
			@PathVariable Long taskId
			){
		return ResponseEntity.ok(commentService.getAllComments(taskId));
	}
	
	@PostMapping("/tasks/{taskId}/comments")
	public ResponseEntity<?> createComment(
			@Valid @RequestBody CommentRequest commentRequest,
			@PathVariable Long taskId,
			Principal principal){
		return ResponseEntity.status(HttpStatus.CREATED).body(commentService.createTaskComment(commentRequest, taskId, principal.getName()));
	}
	
	@DeleteMapping("/comments/{commentId}")
	public ResponseEntity<?> deleteComment(@PathVariable Long commentId, Principal principal){
		commentService.deleteTaskComment(commentId, principal.getName());
		return ResponseEntity.noContent().build();
	}
}
