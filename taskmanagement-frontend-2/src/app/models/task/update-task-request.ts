import { TaskPriority } from "../task-priority";
import { TaskStatus } from "../task-status";

export type UpdateTaskRequest = {
    title?: string;
    description?: string;
    dueDate?: string;
    status?: TaskStatus;         
    priority?: TaskPriority;     // include only if your API updates status here
    assignedTo?: number;      // ID, not User object
};