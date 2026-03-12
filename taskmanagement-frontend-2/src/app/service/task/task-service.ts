import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskRequest } from '../../models/task/task-request.model';
import { Observable } from 'rxjs';
import { Task } from '../../models/task/task-response.model';
import { TaskStatus } from '../../models/task-status';
import { UpdateTaskRequest } from '../../models/task/update-task-request';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) { }

  private readonly API_URL = 'http://localhost:8080/api/tasks';
  private readonly TOKEN_KEY = 'jwt';

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.API_URL}/get-tasks`);
  }

  addTask(task: TaskRequest): Observable<Task> {
    return this.http.post<Task>(`${this.API_URL}/add-task`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/delete-task/${id}`);
  }

  updateStatus(id: number, status: TaskStatus): Observable<any> {
    return this.http.put(`${this.API_URL}/update-status/${id}?status=${status}`, {});
  }

  updateTask(id: number, data: UpdateTaskRequest) {
    return this.http.put<Task>(`${this.API_URL}/update-task/${id}`, data);
  }
}