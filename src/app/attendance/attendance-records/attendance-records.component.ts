import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AttendanceRecord } from 'yct-attendance-collator/src/app/shared/shared.model';
import { AttendanceService } from '../attendance.service';

@Component({
  selector: 'app-attendance-records',
  templateUrl: './attendance-records.component.html',
  styleUrls: ['./attendance-records.component.scss'],
})
export class AttendanceRecordsComponent implements OnInit {
  title: string;
  sessionId: string;
  progId: string;
  courseId: string;
  dailyRecords: AttendanceRecord[];

  constructor(
    private route: ActivatedRoute,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const title = params['year'];
      this.progId = params['progId'];
      this.courseId = params['courseId'];
      this.sessionId = title;

      this.title = this.attendanceService
        .getProgrammes(title)
        .find((programme) => programme._id == this.progId)
        .courses.find((course) => course._id == this.courseId).title;

      this.dailyRecords = this.attendanceService.getRecords(
        title,
        this.progId,
        this.courseId
      );
    });
  }
}
