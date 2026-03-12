package com.taskmanagement.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskmanagement.entity.Activity;
import com.taskmanagement.service.ActivityLogService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {
	
	private final ActivityLogService logService;
	
	@GetMapping
	public List<Activity> getActivity(Principal principal){
		return logService.getRecentActiviy(principal.getName());
	}
}
