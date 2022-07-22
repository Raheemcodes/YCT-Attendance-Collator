import { NgModel } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AttendanceService } from './../../attendance/attendance.service';
import { Course, Programme, Session } from './../../shared/shared.model';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: [
    './../../attendance/create-record/create-record.component.scss',
    './../../attendance/mark-attendance/mark-attendance.component.scss',
    './graph.component.scss',
  ],
})
export class GraphComponent implements OnInit {
  isLoading: boolean = false;
  error: any;
  sessions: Session[] = [];
  sessionTitle: string = '';
  sessionId: string = '';
  programmes: Programme[] = [];
  programmeTitle: string = '';
  programmeId: string = '';
  courses: Course[] = [];
  courseTitle: string = '';

  constructor(
    private attendanceService: AttendanceService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.sessions = [...this.attendanceService.getSessions()].reverse();
    if (this.sessions.length > 0) {
      this.sessionTitle = this.sessions[0].title;
      this.sessionId = this.sessions[0]._id;
      this.programmes = [...this.sessions[0].programmes];
    }
  }

  autoFilter(input: NgModel) {
    if (input.value == '')
      this.sessions = [...this.attendanceService.getSessions()];
    this.sessions = [...this.sessions].filter((session) =>
      session.title.includes(input.value),
    );

  }

  autoFilterProg(prog: NgModel) {
    if (prog.value == '')
      this.sessions = [...this.attendanceService.getSessions()];
    const session = this.sessions.find(
      (session) => session.title == this.sessionTitle,
    );
    if (session) {
      this.sessionId = session._id;
      this.programmes = [...session.programmes].filter((programme) =>
        programme.title.includes(prog.value.toUpperCase()),
      );
    } else {
      this.programmes = [];
    }
  }

  autoFilterCourse(course: NgModel) {
    if (course.value == '')
      this.sessions = [...this.attendanceService.getSessions()];
    const programme = this.programmes.find(
      (programme) => programme.title == this.programmeTitle,
    );
    if (programme) {
      this.programmeId = programme._id;
      this.courses = [...programme.courses].filter((filteredCourse) =>
        filteredCourse.title.includes(course.value.toUpperCase()),
      );
    } else {
      this.courses = [];
    }
  }

  resetProg() {
    this.programmeTitle = ''
    this.courseTitle = ''
    this.programmeId = ''
  }

  resetCourse() {
    this.courseTitle = ''
  }

  onSubmit() {
    const course: Course = this.courses.find(
      (course: Course) => this.courseTitle == course.title,
    );

    this.router.navigate([
      '/graph',
      this.sessionId,
      this.programmeId,
      course._id,
    ]);
  }
}
