import { Component, OnInit } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Course,
  Programme,
  Session,
} from 'yct-attendance-collator/src/app/shared/shared.model';
import { Coordinates } from './../../map/map.component';
import { MapService } from './../../map/map.service';
import { AttendanceService } from './../attendance.service';

@Component({
  selector: 'app-mark-attendance',
  templateUrl: './mark-attendance.component.html',
  styleUrls: [
    './../create-record/create-record.component.scss',
    './mark-attendance.component.scss',
  ],
})
export class MarkAttendanceComponent implements OnInit {
  isLoading: boolean = false;
  error: any;
  sessions: Session[] = [];
  sessionTitle: string = '';
  programmes: Programme[] = [];
  programmeTitle: string = '';
  courses: Course[] = [];
  courseTitle: string = '';
  hour: number = 0;
  minute: number = 30;
  mappingTime: boolean = false;
  createdAttRes: {
    sessionId: string;
    programmeId: string;
    courseId: string;
    attendanceRecordId: string;
  };

  constructor(
    private attendanceService: AttendanceService,
    private mapService: MapService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sessions = [...this.attendanceService.getSessions()].reverse();
    if (this.sessions.length > 0) {
      this.sessionTitle = this.sessions[0].title;
      this.programmes = [...this.sessions[0].programmes];
    }
  }

  autoFilter(input: NgModel) {
    if (input.value == '')
      this.sessions = [...this.attendanceService.getSessions()];
    this.sessions = [...this.sessions].filter((session) =>
      session.title.includes(input.value)
    );
  }

  autoFilterProg(prog: NgModel) {
    if (prog.value == '')
      this.sessions = [...this.attendanceService.getSessions()];
    const session = this.sessions.find(
      (session) => session.title == this.sessionTitle
    );
    if (session) {
      this.programmes = [...session.programmes].filter((programme) =>
        programme.title.includes(prog.value.toUpperCase())
      );
    } else {
      this.programmes = [];
    }
  }

  autoFilterCourse(course: NgModel) {
    if (course.value == '')
      this.sessions = [...this.attendanceService.getSessions()];
    const programme = this.programmes.find(
      (programme) => programme.title == this.programmeTitle
    );
    if (programme) {
      this.courses = [...programme.courses].filter((filteredCourse) =>
        filteredCourse.title.includes(course.value.toUpperCase())
      );
    } else {
      this.courses = [];
    }
  }

  resetProg() {
    this.programmeTitle = '';
    this.courseTitle = '';
  }

  resetCourse() {
    this.courseTitle = '';
  }

  onSubmit() {
    this.mappingTime = true;
  }

  finalize(coordinates: Coordinates) {
    this.attendanceService
      .createAttendance(
        this.sessionTitle,
        this.programmeTitle,
        this.courseTitle,
        this.hour,
        this.minute,
        coordinates
      )
      .subscribe({
        next: (res: {
          attendanceRecordId: string;
          courseId: string;
          programmeId: string;
          sessionId: string;
        }) => {
          this.isLoading = false;
          this.router.navigate([
            'programmes',
            res.sessionId,
            res.programmeId,
            res.courseId,
            res.attendanceRecordId,
          ]);
        },
        error: (errorMessage) => {
          this.isLoading = false;

          if (
            errorMessage == 'Some fields are not in record!' ||
            errorMessage == 'Some fields are not in record!' ||
            errorMessage == 'One attendance per day, for a course!'
          ) {
            this.mappingTime = false;
            setTimeout(() => {
              this.error = errorMessage;
            }, 30);
          } else {
            this.mapService.error.next(errorMessage);
          }
        },
      });
  }
}
