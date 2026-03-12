import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Task } from '../../models/task/task-response.model';
import { TaskStatus } from '../../models/task-status';
import { CommentService } from '../../service/comment/comment-service';
import { Comment } from '../../models/comment/comment-model';
import { CommentRequest } from '../../models/comment/comment-request';
import { FormsModule } from '@angular/forms';
import { TimeAgoPipe } from '../../pipe/time-ago-pipe';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, TimeAgoPipe],
  templateUrl: './task-modal.html',
  styleUrl: './task-modal.css',
})
export class TaskModal {

  @Input() task!: Task;

  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();

  TaskStatus = TaskStatus;

  comments: Comment[] = [];
  commentText: string = '';
  commentsLoading: boolean = false;

  constructor(private commentService: CommentService, private cdr: ChangeDetectorRef) {}

  ngOnChanges(): void {
    if(this.task){
      this.loadComments();
    }
  }

  loadComments(): void {
    this.commentsLoading = true;
    this.commentService.getComments(this.task.id).subscribe({
      next: (res) => {
        this.comments = res;
        this.commentsLoading = false;
        console.log(this.comments);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.log(err.error.errorMessage)
        this.commentsLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  postComment(): void {
    if(!this.commentText.trim())
      return;

    const payload: CommentRequest = {
      body: this.commentText
    }

    this.commentService.addComment(this.task.id, payload).subscribe({
      next: (res) => {
        this.comments = [...this.comments, res];
        console.log(res);
        this.commentText = '';
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.log(err.error.errorMessage);
      }
    });
  }

  deleteComment(commentId: number){
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.comments = this.comments.filter((c) => c.id !== commentId);
      },
      error: (err) => {
        console.log(err.error.errorMessage);
      } 
    });
  }



  getStatusClasses(status: TaskStatus) {
    return {
      'bg-blue-50 text-blue-700': status === TaskStatus.TO_DO,
      'bg-yellow-50 text-yellow-700': status === TaskStatus.IN_PROGRESS,
      'bg-green-50 text-green-700': status === TaskStatus.COMPLETED
    };
  }

}