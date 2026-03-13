package com.taskmanagement.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.taskmanagement.auth.entities.User;
import com.taskmanagement.auth.repositories.UserRepository;
import com.taskmanagement.dto.TaskRequest;
import com.taskmanagement.dto.TaskResponse;
import com.taskmanagement.dto.UpdateTaskRequest;
import com.taskmanagement.dto.UserDto;
import com.taskmanagement.entity.ActionCode;
import com.taskmanagement.entity.Status;
import com.taskmanagement.entity.Task;
import com.taskmanagement.repo.TaskRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;

    @Transactional
    public TaskResponse addTask(TaskRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<User> assigneeOpt = Optional.empty();
        if (request.getAssignedTo() != null) {
            assigneeOpt = userRepository.findById(request.getAssignedTo());
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus())
                .createdAt(LocalDate.now())
                .updatedAt(LocalDate.now())
                .dueDate(request.getDueDate())
                .user(user)
                .assignee(assigneeOpt.orElse(null))
                .priority(request.getPriority())
                .build();

        Task savedTask = taskRepository.save(task);

        // Log: TASK_CREATED
        activityLogService.logAction(
                savedTask.getId(),
                email,
                ActionCode.TASK_CREATED,
                user.getName() + " created task \"" + savedTask.getTitle() + "\""
        );

        // Log: TASK_ASSIGNED (if created with an assignee)
        if (savedTask.getAssignee() != null) {
            activityLogService.logAction(
                    savedTask.getId(),
                    email,
                    ActionCode.TASK_ASSIGNED,
                    user.getName() + " assigned \"" + savedTask.getTitle() + "\" to " + savedTask.getAssignee().getName()
            );
        }

        return convertToResponse(savedTask);
    }

    @Transactional
    public List<TaskResponse> getAllTasks(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return taskRepository.findByUserId(user.getId())
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Transactional
    public void deleteTask(Long id, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to perform this action");
        }

        // Log before deletion so we still have context like title
        activityLogService.logAction(
                task.getId(),
                email,
                ActionCode.TASK_DELETED,
                user.getName() + " deleted task \"" + task.getTitle() + "\""
        );

        taskRepository.delete(task);
    }

    @Transactional
    public TaskResponse updateTaskStatus(Long id, Status status, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to perform this action");
        }

        Status oldStatus = task.getStatus();
        task.setStatus(status);
        task.setUpdatedAt(LocalDate.now());

        Task updatedTask = taskRepository.save(task);

        // Log: TASK_STATUS_CHANGED with from → to
        activityLogService.logAction(
                updatedTask.getId(),
                email,
                ActionCode.TASK_STATUS_CHANGED,
                user.getName() + " changed status of \"" + updatedTask.getTitle() + "\" from " +
                        oldStatus.name() + " to " + updatedTask.getStatus().name()
        );

        return convertToResponse(updatedTask);
    }

    @Transactional
    public TaskResponse updateTask(Long id, UpdateTaskRequest req, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to perform this action");
        }

        // Capture old values for diff logging
        Status oldStatus = task.getStatus();
        var oldPriority = task.getPriority();
        User oldAssignee = task.getAssignee();

        Optional<User> newAssigneeOpt = Optional.empty();
        if (req.getAssignedTo() != null) {
            newAssigneeOpt = userRepository.findById(req.getAssignedTo());
        }
        User newAssignee = newAssigneeOpt.orElse(null);

        // Apply updates
        task.setTitle(req.getTitle());
        task.setDescription(req.getDescription());
        task.setAssignee(newAssignee);
        task.setStatus(req.getStatus());
        task.setPriority(req.getPriority());
        task.setDueDate(req.getDueDate());
        task.setUpdatedAt(LocalDate.now());

        Task updatedTask = taskRepository.save(task);

        // ===== Activity logs based on diffs =====

        // Status change (if updated here)
        if (oldStatus != null && updatedTask.getStatus() != null && oldStatus != updatedTask.getStatus()) {
            activityLogService.logAction(
                    updatedTask.getId(),
                    email,
                    ActionCode.TASK_STATUS_CHANGED,
                    user.getName() + " changed status of \"" + updatedTask.getTitle() + "\" from " +
                            oldStatus.name() + " to " + updatedTask.getStatus().name()
            );
        }

        // Priority change
        if (oldPriority != null && updatedTask.getPriority() != null && oldPriority != updatedTask.getPriority()) {
            activityLogService.logAction(
                    updatedTask.getId(),
                    email,
                    ActionCode.TASK_PRIORITY_CHANGED,
                    user.getName() + " changed priority of \"" + updatedTask.getTitle() + "\" from " +
                            oldPriority.name() + " to " + updatedTask.getPriority().name()
            );
        }

        // Assignee change
        if ((oldAssignee == null && newAssignee != null) ||
            (oldAssignee != null && newAssignee == null) ||
            (oldAssignee != null && newAssignee != null && !oldAssignee.getId().equals(newAssignee.getId()))) {

            String message;
            if (oldAssignee == null && newAssignee != null) {
                message = user.getName() + " assigned \"" + updatedTask.getTitle() + "\" to " + newAssignee.getName();
            } else if (oldAssignee != null && newAssignee == null) {
                message = user.getName() + " unassigned \"" + updatedTask.getTitle() + "\" (was " + oldAssignee.getName() + ")";
            } else {
                message = user.getName() + " reassigned \"" + updatedTask.getTitle() + "\" from " +
                          oldAssignee.getName() + " to " + newAssignee.getName();
            }

            activityLogService.logAction(
                    updatedTask.getId(),
                    email,
                    ActionCode.TASK_ASSIGNED,
                    message
            );
        }

        return convertToResponse(updatedTask);
    }

    private TaskResponse convertToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus().name())
                .createdAt(task.getCreatedAt())
                .dueDate(task.getDueDate())
                .updatedAt(task.getUpdatedAt())
                .assignee(task.getAssignee() != null
                        ? new UserDto(task.getAssignee().getId(), task.getAssignee().getName(), task.getAssignee().getEmail())
                        : null)
                .priority(task.getPriority().name())
                .build();
    }
}