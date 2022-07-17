import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AttendanceService } from './../attendance.service';

@Component({
  selector: 'app-create-record',
  templateUrl: './create-record.component.html',
  styleUrls: ['./create-record.component.scss'],
})
export class CreateRecordComponent implements OnInit {
  min: number = new Date().getFullYear() - 1;
  max: number = new Date().getFullYear() + 1;

  error: any;
  isLoading: boolean = false;
  sessionTitle: string = '';
  progTitle: string = '';
  sessionId: string = ''
  header: string = '';

  constructor(
    private route: ActivatedRoute,
    private attendanceService: AttendanceService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      const sessionId: string = params['session'];
      const progId: string = params['programme'];
      this.sessionId = sessionId

      const session = this.attendanceService
        .getSessions()
        .find((session) => session._id == sessionId);
      const prog = this.attendanceService
        .getProgrammes(sessionId)
        .find((programme) => programme._id == progId);

      if (session) this.sessionTitle = session.title;
      if (prog) this.progTitle = prog.title;
    });
  }

  submit(form: NgForm) {
    this.isLoading = true;

    this.attendanceService
      .createSession(
        form.value.session,
        form.value.programme,
        form.value.course,
        form.value.matricNumber,
        form.value.indexNumber,
        form.value.totalNumber,
        !!this.sessionTitle,
      )
      .subscribe({
        next: () => {
          this.isLoading = false;
          if (!!this.sessionTitle) {
            this.router.navigate(['/programmes/' + this.sessionId]);
          } else {
            this.router.navigate(['/sessions']);
          }
        },
        error: async (err: HttpErrorResponse) => {
          if (err.error.message.length > 40) {
            this.error = 'There is a server error. Try again later!';
          } else {
            this.error = err.error.message;
          }
          this.isLoading = false;
        },
        complete: () => console.info('Created Successfully'),
      });
  }
}
