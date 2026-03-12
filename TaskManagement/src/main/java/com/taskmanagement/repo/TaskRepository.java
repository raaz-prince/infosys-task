package com.taskmanagement.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taskmanagement.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long>{
	List<Task> findByUserId(Long userId);
}
