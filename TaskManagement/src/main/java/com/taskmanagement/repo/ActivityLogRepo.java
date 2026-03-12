package com.taskmanagement.repo;


import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.taskmanagement.entity.Activity;

public interface ActivityLogRepo extends JpaRepository<Activity, Long> {

	@Query("""
			    SELECT a
			       FROM Activity a
			       WHERE a.actor.email = :email
			       ORDER BY a.createdAt DESC
			""")
	List<Activity> findRecentActivityForUser(@Param("email") String email, Pageable pageable);
}
