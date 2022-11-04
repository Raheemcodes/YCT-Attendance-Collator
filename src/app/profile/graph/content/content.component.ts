import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {
  AttendanceRecord,
  Course,
  AttendanceLine,
} from '../../../shared/shared.model';
import { AttendanceService } from './../../../attendance/attendance.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit, AfterViewInit {
  @ViewChild('slide') slide: ElementRef<HTMLElement>;
  title: string;
  sessionId: string;
  progId: string;
  courseId: string;
  dailyRecords: AttendanceRecord[] = [];
  presentOnly: number[];
  course: Course;
  rowLabels: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      // Getting Ids from page's url
      this.sessionId = params['sessionId'];
      this.progId = params['progId'];
      this.courseId = params['courseId'];

      // Fetch Course
      this.course = this.attendanceService
        .getProgrammes(this.sessionId)
        .find((programme) => programme._id == this.progId)
        .courses.find((course) => course._id == this.courseId);

      //  Course title
      this.title = this.course.title;

      // dailyRecords
      this.dailyRecords = this.course.attendanceRecords;

      // Generate bar height
      this.presentOnly = [...this.dailyRecords].map(
        (dailyRecord: AttendanceRecord) => {
          const presentAttendance = dailyRecord.attendance.filter(
            (attendance: AttendanceLine) => attendance.status == 'Present'
          );

          return (
            (presentAttendance.length / dailyRecord.attendance.length) * 100
          );
        }
      );

      // generate row label
      let student: number = 0;
      const numberofSudents: number = this.course.students.length;
      const noOfStudents = numberofSudents / 10;

      for (let i = 10; i >= 0; i--) {
        student = i * noOfStudents;
        this.rowLabels.push(+student.toFixed(2));
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.dailyRecords.length > 0) {
      const el = this.slide.nativeElement;
      el.scrollBy(el.scrollWidth, 0);

      document.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key == 'Home') el.scrollBy(-el.scrollWidth, 0);
        if (event.key == 'End') el.scrollBy(el.scrollWidth, 0);
      });
    }
  }
}
