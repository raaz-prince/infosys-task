import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  
  private activityUpdatedSource = new Subject<void>();

  activityUpdated$ = this.activityUpdatedSource.asObservable();

  notifyActivityUpdated() {
    this.activityUpdatedSource.next();
  }
}
