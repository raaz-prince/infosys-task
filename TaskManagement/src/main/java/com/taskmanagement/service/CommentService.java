package com.taskmanagement.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.taskmanagement.auth.entities.User;
import com.taskmanagement.auth.repositories.UserRepository;
import com.taskmanagement.dto.CommentRequest;
import com.taskmanagement.dto.CommentResponse;
import com.taskmanagement.entity.ActionCode;
import com.taskmanagement.entity.Comment;
import com.taskmanagement.entity.Task;
import com.taskmanagement.repo.CommentRepo;
import com.taskmanagement.repo.TaskRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {

	private final TaskRepository taskRepo;
	private final UserRepository userRepo;
	private final CommentRepo commentRepo;
	private final ActivityLogService activityLogService;
	
	private User requireUser(String email) {
		return userRepo.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User not found"));
	}
	
	public List<CommentResponse> getAllComments(Long taskId){
		List<Comment> comments = commentRepo.findAllByTaskIdOrderByCreatedAtAsc(taskId);
		
		return comments.stream()
				.map(this::convertToResponse)
				.toList();
	}
	
	@Transactional
	public CommentResponse createTaskComment(CommentRequest req, Long taskId, String email) {
		Task task = taskRepo.findById(taskId)
				.orElseThrow(() -> new RuntimeException("Task not found"));
		
		User author = requireUser(email);
		
		Comment comment = Comment.builder()
				.body(req.getBody())
				.author(author)
				.task(task)
				.createdAt(LocalDateTime.now())
				.build();
		
		Comment savedComment = commentRepo.save(comment);
	
		activityLogService.logAction(taskId, author.getEmail(), ActionCode.COMMENT_ADDED,
				author.getName() + " commented on \"" + task.getTitle() + "\""
				);
		return convertToResponse(savedComment);
	}
	
	@Transactional
	public void deleteTaskComment(Long id, String email) {
		Comment comment = commentRepo.findByIdAndAuthorEmail(id, email)
				.orElseThrow(() -> new RuntimeException("Comment not found or access denied"));
		commentRepo.delete(comment);
	}
	
	private CommentResponse convertToResponse(Comment comment) {
		return CommentResponse.builder()
				.id(comment.getId())
				.body(comment.getBody())
				.authorId(comment.getAuthor().getId())
				.authorName(comment.getAuthor().getName())
				.createdAt(comment.getCreatedAt())
				.build();
	}
}
