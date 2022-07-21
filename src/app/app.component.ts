import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AttendanceService } from './attendance/attendance.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'yct-biometric-auth';
  loaded: boolean = false;
  loadComponent: boolean = false;
  block: boolean = false;

  constructor(
    private authService: AuthService,
    private attendanceService: AttendanceService,
    @Inject(PLATFORM_ID) private platformId
  ) {}

  ngOnInit(): void {
    console.log('NgONIT')
    if (isPlatformBrowser(this.platformId)) {
      this.authService.autoLogin();
      document.body.style.overflow = 'hidden';
      this.loadComponent = true;

      if (
        location.pathname == '/' ||
        location.pathname == '/profile' ||
        location.pathname == '/login' ||
        location.pathname == '/signup' ||
        location.pathname == '/not-found' ||
        location.pathname.includes('attendance')
      )
        setTimeout(() => {
          if (document.body.hasAttribute('style')) {
            document.body.removeAttribute('style');
          }
          this.loaded = true;
        }, 3000);

      this.attendanceService.isLoading.subscribe((res) => {
        this.loaded = res;

        document.body.style.overflow = 'hidden';

        if (!this.loaded && document.body.hasAttribute('style')) {
          document.body.removeAttribute('style');
          return;
        }
      });
    }
  }
}
