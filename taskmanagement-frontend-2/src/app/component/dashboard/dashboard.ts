import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TaskService } from '../../service/task/task-service';
import { AddTask } from '../add-task/add-task';
import { TaskCard } from '../task-card/task-card';
import { TaskModal } from '../task-modal/task-modal';

import { ToastrService } from 'ngx-toastr';

import { TaskRequest } from '../../models/task/task-request.model';
import { Task } from '../../models/task/task-response.model';
import { TaskStatus } from '../../models/task-status';
import { UpdateTaskRequest } from '../../models/task/update-task-request';
import { User } from '../../models/user/user-modal';
import { UserService } from '../../service/user/user-service';
import { Analytics } from '../analytics/analytics';
import { ActivityFeed } from '../activity-feed/activity-feed';
import { ActivityService } from '../../service/activity/activity-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AddTask, TaskCard, TaskModal, Analytics, ActivityFeed],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {

  TaskStatus = TaskStatus;

  selectedFilter: TaskStatus | 'ALL' = 'ALL';
  isAddTaskOpen = false;

  showAnalytics = false;
  showActivity = false;

  selectedTask: Task | null = null;
  editingTask: Task | null = null;

  tasks: Task[] = [];
  filteredTasks: Task[] = [];

  users: User[] = [];

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private activityService: ActivityService
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  openAnalytics(): void {
    this.showAnalytics = true;
  }

  hideAnalytics(): void {
    this.showAnalytics = false;
  }

  openModal(task: Task): void {
    this.selectedTask = { ...task };
  }

  closeModal(): void {
    this.selectedTask = null;
  }

  openEditTask(task: Task): void {
    this.selectedTask = null;
    this.editingTask = { ...task }
    this.isAddTaskOpen = true;
    this.loadUsers();
  }

  openAddTask(): void {
    this.isAddTaskOpen = true;
    this.loadUsers();
  }

  closeAddTask(): void {
    this.isAddTaskOpen = false;
    this.editingTask = null;
  }

  handleSave(data: TaskRequest): void {
    if (this.editingTask) {
      this.updateTask(this.editingTask.id, data);
    } else {
      this.createTask(data);
    }
  }

  createTask(data: TaskRequest): void {
    this.taskService.addTask(data).subscribe({
      next: (res: Task) => {
        this.toastr.success('Added Successfully', 'Success', { timeOut: 1500 });

        this.tasks = [res, ...this.tasks];
        this.updateFilteredTasks();
        this.closeAddTask();
        this.activityService.notifyActivityUpdated();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.toastr.error(
          err?.error?.errorMessage ??
          err?.message ??
          'Something went wrong. Please try again.'
        );
      }
    });
  }

  updateTask(id: number, data: TaskRequest): void {

    const payload: UpdateTaskRequest = {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      status: data.status,
      priority: data.priority,
      assignedTo: data.assignedTo,
    }

    this.taskService.updateTask(id, payload).subscribe({
      next: (res: Task) => {

        this.toastr.success('Task Updated', 'Success', { timeOut: 1500 });

        this.tasks = this.tasks.map(t =>
          t.id === res.id ? res : t
        );

        this.updateFilteredTasks();
        this.closeAddTask();
        this.activityService.notifyActivityUpdated();
        this.cdr.markForCheck();

      },
      error: (err) => {
        this.toastr.error(
          err?.error?.errorMessage ??
          err?.message ??
          'Something went wrong.'
        );
      }
    });

  }

  handleDelete(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.toastr.success('Deleted Successfully', 'Success', { timeOut: 1500 });

        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.updateFilteredTasks();
        this.selectedTask = null;
        this.activityService.notifyActivityUpdated();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.toastr.error(
          err?.error?.errorMessage ??
          err?.message ??
          'Something went wrong. Please try again.'
        );
      }
    });
  }

  handleStatusChange(event: { id: number; status: TaskStatus }): void {
    this.taskService.updateStatus(event.id, event.status).subscribe({
      next: () => {
        this.toastr.success('Status Updated Successfully', 'Success', { timeOut: 1500 });

        this.tasks = this.tasks.map(task =>
          task.id === event.id
            ? { ...task, status: event.status }
            : task
        );

        this.updateFilteredTasks();
        this.activityService.notifyActivityUpdated();
        this.cdr.markForCheck();
      }
    });
  }

  changeFilter(filter: TaskStatus | 'ALL'): void {
    this.selectedFilter = filter;
    this.updateFilteredTasks();
    this.cdr.markForCheck();
  }

  private updateFilteredTasks(): void {
    if (this.selectedFilter === 'ALL') {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter(
        task => task.status === this.selectedFilter
      );
    }
  }

  private loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (res: Task[]) => {
        console.log(res);
        this.tasks = res;
        this.updateFilteredTasks();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.toastr.error(
          err?.error?.errorMessage ??
          err?.message ??
          'Something went wrong. Please try again.'
        );
      }
    });
  }

  private loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      console.log(users);
      this.users = users;
      this.cdr.markForCheck();
    });
  }

  get totalCount(): number {
    return this.tasks.length;
  }

  get todoCount(): number {
    return this.tasks.filter(t => t.status === TaskStatus.TO_DO).length;
  }

  get inProgressCount(): number {
    return this.tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
  }

  get completedCount(): number {
    return this.tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  }
}