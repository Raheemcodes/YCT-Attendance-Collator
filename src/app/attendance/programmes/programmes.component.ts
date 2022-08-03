import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Programme } from './../../shared/shared.model';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AttendanceService } from '../attendance.service';
import { take, Subscription } from 'rxjs';

@Component({
  selector: 'app-programmes',
  templateUrl: './programmes.component.html',
  styleUrls: ['./programmes.component.scss'],
})
export class ProgrammesComponent implements OnInit {
  programmes: Programme[] = [];
  sessionId: string;
  backdrop: boolean = false;
  courseEdit: boolean = false;
  courseDelete: boolean = false;
  coursesArray: { _id: string; newTitle: string }[] = [];
  isLoading: boolean = false;
  progIsLoading: boolean = false;
  courseIsLoading: boolean = false;
  confirm: boolean = false;
  confirmMsg: string;
  error: string;
  courseEditError: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private attendanceService: AttendanceService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const id = params['year'];

      this.programmes = this.sort(this.attendanceService.getProgrammes(id));
      this.sessionId = id;

      this.attendanceService.sessionsChanged.subscribe(() => {
        this.programmes = this.sort(this.attendanceService.getProgrammes(id));
      });
    });
  }

  courseAction(course: HTMLLIElement, programeId: string, courseId: string) {
    const courseTitle: HTMLSpanElement = course.querySelector('.course-title');
    const checkBox: HTMLDivElement = course.querySelector('.check-box');
    const courseInput: HTMLInputElement =
      course.querySelector('.edit-title__input');

    if (this.courseEdit || this.courseDelete) {
      if (!checkBox.className.includes('checked')) {
        this.renderer.addClass(checkBox, 'checked');
        if (!this.courseDelete) {
          this.renderer.addClass(courseTitle, 'course-edit');
          this.renderer.removeClass(courseInput, 'course-edit');
        }
      } else {
        this.renderer.removeClass(checkBox, 'checked');
        if (!this.courseDelete) {
          this.renderer.removeClass(courseTitle, 'course-edit');

          this.renderer.addClass(courseInput, 'course-edit');
          courseInput.value = courseTitle.textContent;
        }
      }
    } else {
      this.router.navigate([programeId, courseId], { relativeTo: this.route });
    }
  }

  startEditCourse(listEl: HTMLLIElement, event: Event) {
    event.stopPropagation();
    if (this.courseDelete) this.closeEditCourse(listEl);
    this.courseEdit = true;
    const detail: HTMLDetailsElement = listEl.querySelector('details');

    this.closeDetails(detail);
  }

  startDeleteCourse(listEl: HTMLLIElement, event: Event) {
    event.stopPropagation();
    if (this.courseEdit) this.closeEditCourse(listEl);
    this.courseDelete = true;
    const detail: HTMLDetailsElement = listEl.querySelector('details');

    this.closeDetails(detail);
  }

  startEditProg(listEl: HTMLLIElement, event: Event) {
    event.stopPropagation();
    const head: HTMLHeadingElement = listEl.querySelector('h1');
    const form: HTMLDivElement = listEl.querySelector('.edit-cover');
    const detail: HTMLDetailsElement = listEl.querySelector('details');

    this.closeDetails(detail);
    this.renderer.setStyle(head, 'display', 'none');
    this.renderer.setStyle(form, 'display', 'flex');
  }

  // split into edit and delete function abdul!!!
  // split into edit and delete function abdul!!!
  // split into edit and delete function abdul!!!
  // split into edit and delete function abdul!!!
  onEditCourse(listEl: HTMLLIElement) {
    this.courseEditError = '';
    const programmeId: string = listEl.id;
    const courses: NodeList = listEl.querySelectorAll('.course');
    const programme: Programme = this.programmes.find(
      (prog) => prog._id == programmeId
    );

    courses.forEach((course: HTMLLIElement, index: number) => {
      const checkBox: HTMLDivElement = course.querySelector('.check-box');
      const courseInput: HTMLInputElement =
        course.querySelector('.edit-title__input');

      if (checkBox.className.includes('checked')) {
        if (!this.courseDelete) {
          if (
            programme.courses[index].title == courseInput.value ||
            !courseInput.value.trim()
          )
            this.courseEditError = 'Invalid course input';

          this.coursesArray.push({
            _id: courseInput.id,
            newTitle: courseInput.value,
          });
        } else {
          this.coursesArray.push({
            _id: programme.courses[index]._id,
            newTitle: null,
          });
        }
      }
    });

    if (this.coursesArray.length == 0) {
      this.courseEditError = 'No course was selected!';
      return;
    }

    if (this.courseEditError) {
      this.coursesArray = [];
      return;
    }

    this.confirm = true;
    this.confirmMsg = !this.courseDelete
      ? 'Are you sure you want to edit these courses?'
      : 'Are you sure you want to delete these courses?';

    this.attendanceService.confimation.pipe(take(1)).subscribe((res) => {
      if (res == 'proceed') {
        this.confirm = false;

        if (!this.courseDelete) {
          this.courseIsLoading = true;

          this.attendanceService
            .modifyCourse(this.sessionId, programmeId, this.coursesArray)
            .subscribe({
              next: () => {
                this.coursesArray = [];
                this.courseEditError = '';
                this.courseIsLoading = false;
                this.courseEdit = false;
              },
              error: async (errorMessage: string) => {
                this.coursesArray = [];
                console.log(errorMessage);
                this.courseEditError = errorMessage;
                alert(this.courseEditError);
                this.courseIsLoading = false;
              },
              complete: () => console.info('Edited Successfully'),
            });
        } else {
          this.isLoading = true;

          this.attendanceService
            .deleteCourse(this.sessionId, programmeId, this.coursesArray)
            .subscribe({
              next: () => {
                this.coursesArray = [];
                this.isLoading = false;
                this.courseDelete = false;
              },
              error: async (errorMessage: string) => {
                this.coursesArray = [];
                console.log(errorMessage);
                alert(this.courseEditError);
                this.isLoading = false;
              },
              complete: () => console.info('Deleteted Successfully'),
            });
        }
      } else {
        this.coursesArray = [];
        this.confirm = false;
        this.confirmMsg = null;
      }
    });
  }

  onEditProg(form: NgForm, idx: number) {
    if (this.programmes[idx].title == form.value.edittedProg.trim()) {
      this.error = 'Use a diffent title!';
      alert(this.error);
      return;
    }

    this.progIsLoading = true;

    this.attendanceService
      .modifyProgramme(
        this.sessionId,
        this.programmes[idx]._id,
        form.value.edittedProg
      )
      .subscribe({
        next: () => {
          this.error = '';
          this.progIsLoading = false;
        },
        error: async (errorMessage: string) => {
          console.log(errorMessage);
          this.error = errorMessage;
          alert(this.error);
          this.progIsLoading = false;
        },
        complete: () => console.info('Edited Successfully'),
      });
  }

  closeEditCourse(listEl: HTMLLIElement) {
    this.closeCourseActFn(listEl);
    this.courseEdit = false;
    this.courseDelete = false;
  }

  closeCourseActFn(listEl: HTMLLIElement) {
    const courses: NodeList = listEl.querySelectorAll('.course');
    this.courseEditError = '';

    courses.forEach((course: HTMLLIElement) => {
      const courseTitle: HTMLSpanElement =
        course.querySelector('.course-title');
      const checkBox: HTMLDivElement = course.querySelector('.check-box');
      const courseInput: HTMLInputElement =
        course.querySelector('.edit-title__input');

      this.renderer.removeClass(checkBox, 'checked');
      if (!this.courseDelete) {
        this.renderer.removeClass(courseTitle, 'course-edit');
        this.renderer.addClass(courseInput, 'course-edit');
        courseInput.value = courseTitle.textContent;
      }
    });
  }

  closeEditProg(listEl: HTMLLIElement) {
    const head: HTMLHeadingElement = listEl.querySelector('h1');
    const form: HTMLDivElement = listEl.querySelector('.edit-cover');

    this.renderer.removeAttribute(head, 'style');
    this.renderer.removeAttribute(form, 'style');
  }

  deleteProg(progId: string, detail: HTMLDetailsElement) {
    this.confirm = true;
    this.confirmMsg = 'Are you sure you want to delete this programme?';

    this.attendanceService.confimation.pipe(take(1)).subscribe((res) => {
      if (res == 'proceed') {
        this.isLoading = true;
        this.confirm = false;
        this.confirmMsg = null;
        this.attendanceService
          .deleteProgramme(this.sessionId, progId)
          .subscribe({
            next: () => {
              this.error = '';
              this.isLoading = false;
              this.closeDetails(detail);
            },
            error: async (err: HttpErrorResponse) => {
              this.isLoading = false;
              console.log(err.error.message);
              this.closeDetails(detail);
              this.error = err.error.message;
              alert(this.error);
            },
            complete: () => console.info('Deleted Successfully'),
          });
      } else {
        this.confirm = false;
        this.confirmMsg = null;
      }
    });
  }

  sort(array: any[]) {
    const sortedArray = [...array].sort((a, b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });

    return sortedArray;
  }

  closeDetails(detail: HTMLDetailsElement) {
    if (!detail.hasAttribute('open')) return;
    detail.removeAttribute('open');
  }

  dropdown(listEl: HTMLLIElement, prog: HTMLUListElement) {
    const unordered: HTMLUListElement = listEl.querySelector('.courses');
    const detail: HTMLDetailsElement = listEl.querySelector('details');

    if (unordered.style.display == 'block') return;
    this.closedropdown(prog);
    unordered.style.display = 'block';
    detail.style.display = 'block';
  }

  closedropdown(programmes: HTMLUListElement) {
    const courses: NodeList = programmes.querySelectorAll('.courses');
    const details: NodeList = programmes.querySelectorAll('details');
    const programme: NodeList = programmes.querySelectorAll('.programme');

    courses.forEach((el: HTMLElement) => el.removeAttribute('style'));
    details.forEach((el: HTMLElement) => el.removeAttribute('style'));
    programme.forEach((el: HTMLLIElement) => {
      this.closeEditProg(el);
      if (this.courseEdit) this.closeCourseActFn(el);
    });
    this.courseEdit = false;
  }
}
