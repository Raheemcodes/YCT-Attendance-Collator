import { Component, Input, OnInit } from '@angular/core';
import { AttendanceService } from './../../attendance/attendance.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() message: string;

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {}

  cancel() {
    this.attendanceService.confimation.next('cancel');
  }

  proceed() {
    this.attendanceService.confimation.next('proceed');
  }
}
