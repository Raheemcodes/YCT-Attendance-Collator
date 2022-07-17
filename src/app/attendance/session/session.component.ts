import { Component, OnInit } from '@angular/core';
import { Session } from 'src/app/shared/shared.model';
import { AttendanceService } from '../attendance.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent implements OnInit {
  sessions: Session[];

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.sessions = [...this.attendanceService.getSessions()].reverse();
  }
}
