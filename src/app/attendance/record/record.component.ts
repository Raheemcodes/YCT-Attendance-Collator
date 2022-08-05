import { AttendanceRecord } from './../../shared/shared.model';
import { environment } from './../../../environments/environment';
import { AuthService } from './../../auth/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AttendanceService } from '../attendance.service';
import { AttendanceLine } from 'src/app/shared/shared.model';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss'],
})
export class RecordComponent implements OnInit, OnDestroy {
  details: AttendanceRecord;
  attendance: AttendanceLine[] = [];
  date: string;
  isLoading: boolean = true;
  statusProcessing: boolean = false;
  clicked: boolean = false;
  link: string = '';
  minutes: number = 0;
  hours: number = 0;
  clearTimeout: any;
  sessionId: string;
  progId: string;
  courseId: string;
  recordId: string;

  constructor(
    private route: ActivatedRoute,
    private attendanceService: AttendanceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.sessionId = params['year'].toLowerCase();
      this.progId = params['progId'].toLowerCase();
      this.courseId = params['courseId'].toLowerCase();
      this.recordId = params['recordId'].toLowerCase();
      this.details = this.attendanceService.getRecord(
        this.sessionId,
        this.progId,
        this.courseId,
        this.recordId
      );
      this.setAttendance();

      this.attendanceService.sessionsChanged.subscribe(() => {
        this.details = this.attendanceService.getRecord(
          this.sessionId,
          this.progId,
          this.courseId,
          this.recordId
        );
        this.setAttendance();
      });
    });
  }

  copy(el: HTMLInputElement) {
    if (!navigator.clipboard) {
      el.select();
      return;
    }

    navigator.clipboard
      .writeText(el.value)
      .then(() => alert('Copied to clipboard'))
      .catch((err) => {
        console.log(err);
        alert('Error copying text! Try again or copy manually');
      });
  }

  share(el: HTMLInputElement) {
    if (!navigator.share) {
      el.select();
      return;
    }

    navigator.share({ url: el.value }).catch((err) => {
      console.log(err);
      alert('Error sharing text! Try again or copy manually');
    });
  }

  setAttendance() {
    this.isLoading = false;

    this.attendance = [...this.details.attendance];

    this.date = this.details.date.split(',')[0].replaceAll('/', '-');

    this.details.tokenResetExpiration;

    this.authService.user.subscribe((user) => {
      if (new Date(this.details.tokenResetExpiration) > new Date() && !!user) {
        this.link = `${environment.frontEndAddress}/attendance/${user.id}/${this.sessionId}/${this.progId}/${this.courseId}/${this.recordId}/${this.details.token}`;
        const time = new Date(
          new Date(this.details.tokenResetExpiration).getTime() - Date.now()
        );

        this.hours = time.getUTCHours();
        this.minutes = time.getUTCMinutes();

        if (this.minutes == 60) {
          this.minutes = 0;
          this.hours++;
        }
        this.clearTimeout = setInterval(() => {
          this.minutes--;
          if (this.minutes == -1) {
            this.hours--;
            this.minutes = 59;
          }
          if (this.minutes == 60) {
            this.minutes = 0;
            this.hours++;
          }

          if (this.hours == 0 && this.minutes == 0) {
            clearInterval(this.clearTimeout);
          }
        }, 60000);
      }
    });
  }

  changeStatus(status: boolean, id: string) {
    this.statusProcessing = true;

    this.attendanceService
      .markAttendance(
        this.sessionId,
        this.progId,
        this.courseId,
        this.recordId,
        id,
        status
      )
      .subscribe({
        next: (res) => {
          this.clicked = false;
          this.statusProcessing = false;
        },
        error: (err) => {
          console.error(err.error.message);
          this.statusProcessing = false;
        },
      });
  }

  onSearch(searchInput: HTMLInputElement) {
    this.attendance = [...this.details.attendance].filter((attendanceLine) =>
      attendanceLine.matricNumber.includes(searchInput.value.toUpperCase())
    );

    if (this.attendance.length == 0)
      this.attendance = [...this.details.attendance];
  }

  sortBy(opt: string, index: HTMLSpanElement, status: HTMLSpanElement) {
    if (opt == 'status') {
      this.attendance = [...this.details.attendance].sort((a, b) => {
        const nameA = a.status.toUpperCase(); // ignore upper and lowercase
        const nameB = b.status.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return 1;
        if (nameA > nameB) return -1;
        return 0;
      });
      status.classList.remove('inactive');
      index.classList.add('inactive');
    } else {
      this.attendance = [...this.details.attendance];
      status.classList.add('inactive');
      index.classList.remove('inactive');
    }
  }

  dropdown(el: HTMLDivElement, list: HTMLUListElement) {
    const centered =
      'display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex;';
    if (!this.clicked) {
      el.nextElementSibling.setAttribute('style', centered);
      el.lastElementChild.setAttribute('style', 'transform: rotateZ(90deg)');
      this.clicked = true;
    } else {
      this.closeDropdown(list);
    }
  }

  closeDropdown(el: HTMLUListElement) {
    const arrow = el.querySelectorAll('.dropdown-arrow');
    const dropdown: NodeList = el.querySelectorAll('.status-opt');
    dropdown.forEach((el: HTMLDivElement, idx) => {
      if (arrow[idx].hasAttribute('style')) arrow[idx].removeAttribute('style');
      el.style.display = 'none';
    });
    this.clicked = false;
  }

  ngOnDestroy(): void {
    clearInterval(this.clearTimeout);
  }
}
