import { TaskStatus } from "../task-status";
import { TaskPriority } from "../task-priority";
import { User } from "../user/user-modal";

export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt: string;
    dueDate: string;
    updatedAt: string;

    assignee?: User;
    priority: TaskPriority;
}