import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { StudentService } from '../student.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {
  @ViewChild('cover') slideEl: ElementRef<HTMLDivElement>;
  isRegistered: boolean = false;
  matricNum: string = '';
  isLoading: boolean = false;
  startPos = 0;
  currentTranslate = 0;
  error: any;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.matricNum = this.studentService.studentAuthDetails.matricNumber;
    this.isRegistered = this.studentService.studentAuthDetails.isRegistered;

    this.studentService.sucessMessage.subscribe((success) => {
      if (!!success && !this.isRegistered) {
        setTimeout(() => {
          this.isRegistered = true;
          this.isLoading = false;
        }, 2000);
      }
      if (this.isRegistered) {
        this.close(this.slideEl.nativeElement);
      }
    });

    this.studentService.errorMessage.subscribe((error) => {
      console.log(error);
      this.error = error;
      this.isLoading = false;
    });
  }

  onSignup(form: NgForm) {
    this.isLoading = true;
    const teacherId = this.studentService.studentAuthDetails.teacherId;
    const sessionId = this.studentService.studentAuthDetails.sessionId;
    const progId = this.studentService.studentAuthDetails.progId;
    const courseId = this.studentService.studentAuthDetails.courseId;
    const recordId = this.studentService.studentAuthDetails.recordId;
    const attendanceId = this.studentService.studentAuthDetails.attendanceId;
    const token = this.studentService.studentAuthDetails.linkToken;

    this.studentService
      .webAuthnReg(
        teacherId,
        sessionId,
        progId,
        courseId,
        recordId,
        attendanceId,
        token,
        form.value.matricNumber,
      )
      .subscribe({
        next: () => {
          console.log('varifying...');
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          if (err['error']['message']) {
            this.error = err.error.message;
            console.log(err.error.message);
            return;
          }
          this.error = 'Opreation timed out or terminated';
          console.log(err);
        },
      });
  }

  onLogin(form: NgForm) {
    this.isLoading = true;
    const teacherId = this.studentService.studentAuthDetails.teacherId;
    const sessionId = this.studentService.studentAuthDetails.sessionId;
    const progId = this.studentService.studentAuthDetails.progId;
    const courseId = this.studentService.studentAuthDetails.courseId;
    const recordId = this.studentService.studentAuthDetails.recordId;
    const attendanceId = this.studentService.studentAuthDetails.attendanceId;
    const status = this.studentService.studentAuthDetails.stautus;
    const token = this.studentService.studentAuthDetails.linkToken;

    this.studentService
      .webauthnLogin(
        teacherId,
        sessionId,
        progId,
        courseId,
        recordId,
        attendanceId,
        token,
        status,
        form.value.matricNumber,
      )
      .subscribe({
        next: () => {
          console.log('varifying...');
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          if (err['error']['message']) {
            this.error = err.error.message;
            console.log(err.error.message);
            return;
          }
          this.error = 'Opreation timed out or terminated';
          console.log(err);
        },
      });
  }

  onTouchStart(e) {
    this.startPos = e.touches[0].clientY;
  }

  onTouchMove(e) {
    const currentPosition = e.touches[0].clientY;
    this.currentTranslate = currentPosition - this.startPos;
    if (this.currentTranslate > 0) {
      this.setSliderPosition(this.slideEl.nativeElement);
    } else {
      this.slideEl.nativeElement.style.transform = `translateY(${0}%)`;
    }
  }

  onTouchEnd() {
    const movedBy = this.currentTranslate;

    // // if moved enough negative then snap to next slide if there is one
    if (movedBy > this.slideEl.nativeElement.clientHeight / 2) {
      this.slideEl.nativeElement.style.transform = `translateY(${100}%)`;
      this.close(this.slideEl.nativeElement);
    } else {
      this.slideEl.nativeElement.style.transform = `translateY(${0}%)`;
    }
    this.startPos = 0;
    this.currentTranslate = 0;
  }

  setSliderPosition(slider: HTMLDivElement) {
    slider.style.transform = `translateY(${this.currentTranslate}px)`;
  }

  close(el: HTMLDivElement) {
    el.classList.add('slide-out');
    setTimeout(() => {
      this.studentService.close();
    }, 500);
  }
}
