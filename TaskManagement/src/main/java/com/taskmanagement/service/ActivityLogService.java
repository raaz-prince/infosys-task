package com.taskmanagement.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.taskmanagement.auth.entities.User;
import com.taskmanagement.auth.repositories.UserRepository;
import com.taskmanagement.entity.ActionCode;
import com.taskmanagement.entity.Activity;
import com.taskmanagement.repo.ActivityLogRepo;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ActivityLogService {
	
	private final ActivityLogRepo activityLogRepo;
	private final UserRepository userRepo;
	
	@Transactional
	public void logAction(
			Long taskId,
			String actorEmail,
			ActionCode actionCode,
			String meString
			) {
		User actor = userRepo.findByEmail(actorEmail)
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		Activity activity = Activity.builder()
				.taskId(taskId)
				.actor(actor)
				.actionCode(actionCode)
				.message(meString)
				.createdAt(LocalDateTime.now())
				.build();
		
		activityLogRepo.save(activity);
	}
	
	public List<Activity> getRecentActiviy(String email){
		return activityLogRepo.findRecentActivityForUser(
				email,
				PageRequest.of(0, 20)
				);
	}
}
