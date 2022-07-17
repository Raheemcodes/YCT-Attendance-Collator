import { AttendanceService } from './../../attendance/attendance.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  user: User;
  firstName: string;
  lastName: string;
  email: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private attendanceService: AttendanceService,
  ) {}

  ngOnInit(): void {
    const route = innerWidth < 768 ? '/details' : '/profile/details';
    this.router.navigate([route]);
    window.onresize = () => {
      const route = innerWidth < 768 ? '/details' : '/profile/details';
      this.router.navigate([route]);
    };
    this.authService.user.subscribe((user) => {
      this.attendanceService.isLoading.next(!!user);
      this.user = user;
    });
    this.firstName = this.user.name.split(' ')[1];
    this.lastName = this.user.name.split(' ')[0];
    this.email = this.user.email;
  }

  ngOnDestroy(): void {}
}
