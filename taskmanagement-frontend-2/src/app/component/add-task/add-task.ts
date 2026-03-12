// import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { FormsModule, NgForm } from '@angular/forms';

// import { TaskRequest } from '../../models/task/task-request.model';
// import { User } from '../../models/user/user.modal';
// import { TaskPriority } from '../../models/task-priority';
// import { TaskStatus } from '../../models/task-status';

// @Component({
//   selector: 'app-add-task',
//   standalone: true,
//   imports: [FormsModule],
//   templateUrl: './add-task.html',
//   styleUrl: './add-task.css',
// })
// export class AddTask {

//   @Input() users: User[] = [];
//   @Output() close = new EventEmitter<void>();
//   @Output() save = new EventEmitter<TaskRequest>();

//   Priority = TaskPriority;
//   Status = TaskStatus;

//   formData: TaskRequest = {
//     title: '',
//     description: '',
//     dueDate: '',
//     status: TaskStatus.TO_DO,
//     priority: TaskPriority.MEDIUM,
//     assignedTo: undefined
//   };

//   // Today's date in yyyy-mm-dd format (used for min attribute in date input)
//   get todayISO(): string {
//     const d = new Date();

//     const yyyy = d.getFullYear();
//     const mm = String(d.getMonth() + 1).padStart(2, '0');
//     const dd = String(d.getDate()).padStart(2, '0');

//     return `${yyyy}-${mm}-${dd}`;
//   }

//   closeModal(): void {
//     this.close.emit();
//   }

//   onSubmit(form: NgForm): void {
//     if (form.invalid) {
//       return;
//     }

//     console.log(this.formData);

//     // Emit a copy (good practice — avoids reference mutation issues)
//     this.save.emit({ ...this.formData });

//     // Optional reset
//     // this.formData = {
//     //   title: '',
//     //   description: '',
//     //   dueDate: ''
//     // };
//   }
// }

import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { TaskRequest } from '../../models/task/task-request.model';
import { Task } from '../../models/task/task-response.model';
import { User } from '../../models/user/user-modal';
import { TaskPriority } from '../../models/task-priority';
import { TaskStatus } from '../../models/task-status';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-task.html',
  styleUrl: './add-task.css',
})
export class AddTask implements OnChanges {
  @Input() users: User[] = [];

  // used for edit
  @Input() task?: Task | null = null;
  @Input() isEditMode = false;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<TaskRequest>();

  Priority = TaskPriority;
  Status = TaskStatus;

  formData: TaskRequest = {
    title: '',
    description: '',
    dueDate: '',
    status: TaskStatus.TO_DO,
    priority: TaskPriority.MEDIUM,
    assignedTo: undefined,
  };

  ngOnChanges(): void {
    if (this.task) {
      this.formData = {
        title: this.task.title,
        description: this.task.description,
        dueDate: this.task.dueDate,
        status: this.task.status,
        priority: this.task.priority,
        assignedTo: this.task.assignee?.id,
      };
    }
  }

  get todayISO(): string {
    const d = new Date();

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
  }

  closeModal(): void {
    this.formData = {
      title: '',
      description: '',
      dueDate: '',
      status: TaskStatus.TO_DO,
      priority: TaskPriority.MEDIUM,
      assignedTo: undefined,
    };

    this.close.emit();
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    this.save.emit({ ...this.formData });
  }
}