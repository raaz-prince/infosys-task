package com.taskmanagement.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.taskmanagement.entity.Comment;

public interface CommentRepo extends JpaRepository<Comment, Long> {
	List<Comment> findAllByTaskIdOrderByCreatedAtAsc(Long taskId);

	Optional<Comment> findByIdAndAuthorEmail(Long id, String email);

	@Query("""
			 SELECT c FROM Comment c
			         JOIN FETCH c.author
			         WHERE c.task.id = :taskId
			         ORDER BY c.createdAt DESC
			""")
	List<Comment> findAllCommentsWithAuthor(@Param("taskId") Long taskId);
}
