import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskStatus } from '../../models/task-status';
import { Task } from '../../models/task/task-response.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
})
export class TaskCard {

  TaskStatus = TaskStatus;
  statuses = Object.values(TaskStatus);

  @Input() task!: Task;

  @Output() deleteTask = new EventEmitter<number>();
  @Output() statusChange = new EventEmitter<{ id: number; status: TaskStatus }>();
  @Output() viewTask = new EventEmitter<Task>();
  @Output() editTask = new EventEmitter<Task>();

  showDropdown = false;

  constructor(private elementRef: ElementRef) { }

  // Card click → open modal
  onCardClick(): void {
    if(this.showDropdown){
      this.showDropdown = false;
      return;
    }
    this.viewTask.emit(this.task);
  }

  // Edit button
  onEditClick(event: Event): void {
    event.stopPropagation();
    this.editTask.emit(this.task);
  }

  // Delete button
  onDeleteClick(event: Event): void {
    event.stopPropagation();
    this.deleteTask.emit(this.task.id);
  }

  // Toggle dropdown
  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  // Change task status
  changeStatus(status: TaskStatus, event: Event): void {

    event.stopPropagation();

    this.statusChange.emit({
      id: this.task.id,
      status: status
    });

    this.showDropdown = false;
  }

  // Status styling
  getStatusClasses(status: TaskStatus) {
    return {
      'bg-blue-50 text-blue-700 hover:bg-blue-100':
        status === TaskStatus.TO_DO,

      'bg-yellow-50 text-yellow-700 hover:bg-yellow-100':
        status === TaskStatus.IN_PROGRESS,

      'bg-green-50 text-green-700 hover:bg-green-100':
        status === TaskStatus.COMPLETED,

      'font-semibold ring-1 ring-gray-300':
        status === this.task.status
    };
  }

  // Close dropdown if clicked outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {

    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }

  }

}