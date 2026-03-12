import { TaskStatus } from "../task-status";
import { TaskPriority } from "../task-priority";

export interface TaskRequest {
    title: string;
    description: string;
    dueDate: string;
    status: TaskStatus;
    assignedTo?: number;
    priority?: TaskPriority;
}