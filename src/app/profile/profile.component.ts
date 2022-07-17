import { AttendanceService } from './../attendance/attendance.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [
    trigger('navWidth', [
      state(
        'normal',
        style({
          width: '50%',
          marginRight: '0',
        }),
      ),
      state(
        'clicked',
        style({
          width: '14%',
          marginRight: '0.5rem',
        }),
      ),
      transition('normal <=> clicked', animate(1000)),
    ]),
  ],
})
export class ProfileComponent implements OnInit {
  user: User;
  firstName: string;
  innitials: string;
  state: string = 'normal';
  screenWidth: number;

  constructor(
    private authService: AuthService,
    private router: Router,
    private attendanceService: AttendanceService,
  ) {}

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.state = location.pathname != '/profile' ? 'clicked' : 'normal';
    window.onresize = () => {
      this.screenWidth = window.innerWidth;
    };
    this.authService.user.subscribe((user) => {
      this.attendanceService.isLoading.next(!!user);
      this.user = user;
      if (!this.user) {
        this.router.navigate(['/']);
      }
    });
    this.firstName = this.user.name.split(' ')[1];
    this.innitials = this.user.name.split(' ')[1][0] + this.user.name[0];
    window.onpopstate = () => {
      this.state = location.pathname != '/profile' ? 'clicked' : 'normal';
    };
  }

  onClick() {
    this.state = 'clicked';
  }

  isProfileChild(str: string) {
    return /^profile\/\S+/.test(str);
  }

  onLogout() {
    this.state = 'normal';
    setTimeout(() => {
      this.authService.logout();
      location.pathname = '/';
    }, 1000);
  }
}
