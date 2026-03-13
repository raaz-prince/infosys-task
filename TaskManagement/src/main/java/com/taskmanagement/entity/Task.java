package com.taskmanagement.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.taskmanagement.auth.entities.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Task {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	private String title;
	private String description;
	
	@Enumerated(EnumType.STRING)
	private Status status;
	
	private LocalDate createdAt;
	private LocalDate updatedAt;
	private LocalDate dueDate;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "assigned_to")
	private User assignee;
	
	@Enumerated(EnumType.STRING)
	private Priority priority;
	
	@OneToMany(mappedBy = "task",
			cascade = CascadeType.ALL,
			orphanRemoval = true)
	private List<Comment> comments;
	
	public void addComment(Comment comment) {
		if(comments == null){
			comments = new ArrayList<>();
		}
		comments.add(comment);
		comment.setTask(this);
	}
	
	public void removeComment(Comment comment) {
		if(comments != null) {
			comments.remove(comment);
		}
		comment.setTask(null);
	}
}
