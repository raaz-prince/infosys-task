import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

import { Task } from '../../models/task/task-response.model';
import { TaskStatus } from '../../models/task-status';
import { TaskPriority } from '../../models/task-priority';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './analytics.html',
})
export class Analytics {

  @Input() tasks: Task[] = [];

  @Output() hideAnalytics = new EventEmitter<void>();

  TaskStatus = TaskStatus;
  TaskPriority = TaskPriority;

  // ===============================
  // COMPUTED METRICS
  // ===============================

  get totalTasks(): number {
    return this.tasks.length;
  }

  get completedTasks(): number {
    return this.tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  }

  get completionRate(): number {
    if (!this.totalTasks) return 0;
    return Math.round((this.completedTasks / this.totalTasks) * 100);
  }

  get overdueCount(): number {
    const today = new Date().toISOString().split('T')[0];

    return this.tasks.filter(
      t => t.dueDate < today && t.status !== TaskStatus.COMPLETED
    ).length;
  }

  get dueToday(): number {
    const today = new Date().toISOString().split('T')[0];

    return this.tasks.filter(
      t => t.dueDate === today
    ).length;
  }

  get tasksThisWeek(): number {
    const today = new Date();
    const weekLater = new Date();

    weekLater.setDate(today.getDate() + 7);

    return this.tasks.filter(t => {
      const due = new Date(t.dueDate);
      return due >= today && due <= weekLater;
    }).length;
  }

  // ===============================
  // PIE CHART (Task Status)
  // ===============================

  get pieChartData() {
    return {
      labels: ['To Do', 'In Progress', 'Completed'],
      datasets: [
        {
          data: [
            this.tasks.filter(t => t.status === TaskStatus.TO_DO).length,
            this.tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
            this.tasks.filter(t => t.status === TaskStatus.COMPLETED).length
          ],
          backgroundColor: ['#3b82f6', '#f59e0b', '#10b981']
        }
      ]
    };
  }

  // ===============================
  // BAR CHART (Priority)
  // ===============================

  get barChartData() {
    return {
      labels: ['HIGH', 'MEDIUM', 'LOW'],
      datasets: [
        {
          label: 'Tasks',
          data: [
            this.tasks.filter(t => t.priority === TaskPriority.HIGH).length,
            this.tasks.filter(t => t.priority === TaskPriority.MEDIUM).length,
            this.tasks.filter(t => t.priority === TaskPriority.LOW).length
          ],
          backgroundColor: ['#ef4444', '#f97316', '#22c55e']
        }
      ]
    };
  }

  fullHeightChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false, // key: let canvas fill its container height
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: { boxWidth: 12, font: { size: 11 } }
      },
      tooltip: {
        bodyFont: { size: 11 },
        titleFont: { size: 12 }
      }
    },
    // applies to bar only; pie ignores scales
    scales: {
      x: {
        ticks: { font: { size: 11 }, maxRotation: 0 },
        grid: { display: false }
      },
      y: {
        ticks: { font: { size: 11 } },
        grid: { color: 'rgba(0,0,0,0.06)' }
      }
    }
  };


  // ===============================
  // BUTTON ACTION
  // ===============================

  onHideAnalytics(): void {
    this.hideAnalytics.emit();
  }

}