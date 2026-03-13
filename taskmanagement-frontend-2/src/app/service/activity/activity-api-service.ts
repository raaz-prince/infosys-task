import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity } from '../../models/activity/activity-model';

@Injectable({
  providedIn: 'root',
})
export class ActivityApiService {
  
  private readonly API_URL = 'http://localhost:8080/api/activities';

  constructor(private http: HttpClient) {}

  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.API_URL);
  }
}
