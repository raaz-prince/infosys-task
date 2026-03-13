import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivityService } from '../../service/activity/activity-service';
import { ActivityApiService } from '../../service/activity/activity-api-service';
import { TimeAgoPipe } from '../../pipe/time-ago-pipe';
import { CommonModule } from '@angular/common';
import { Activity } from '../../models/activity/activity-model';

@Component({
  selector: 'app-activity-feed',
  imports: [TimeAgoPipe, CommonModule],
  templateUrl: './activity-feed.html',
  styleUrl: './activity-feed.css',
})
export class ActivityFeed {

  activities: Activity[] = [];
  loading = false;

  constructor(
    private activityService: ActivityService,
    private activityApi: ActivityApiService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadActivities();

    this.activityService.activityUpdated$
      .subscribe(() => this.loadActivities());
  }

  loadActivities() {
    this.loading = true;

    this.activityApi.getActivities().subscribe({
      next: (res) => {
        this.activities = res;
        this.loading = false;
        console.log(this.activities);
        this.cdr.markForCheck();
      }
    })

  }

  getAvatarColor(initials: string) {

    const colors = [
      'bg-blue-600',
      'bg-orange-500',
      'bg-purple-600',
      'bg-green-600',
      'bg-red-500',
      'bg-indigo-600'
    ];

    const index = initials.charCodeAt(0) % colors.length;

    return colors[index];

  }
}