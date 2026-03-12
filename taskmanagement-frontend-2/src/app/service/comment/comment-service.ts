import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../../models/comment/comment-model';
import { CommentRequest } from '../../models/comment/comment-request';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly API_URL  = 'http://localhost:8080/api';

  constructor(private http: HttpClient){}

  getComments(taskId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.API_URL}/tasks/${taskId}/comments`);
  }

  addComment(taskId: number, data: CommentRequest): Observable<Comment>{
    return this.http.post<Comment>(`${this.API_URL}/tasks/${taskId}/comments`, data);
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/comments/${commentId}`)
  }
}
