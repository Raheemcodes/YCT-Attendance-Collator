import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
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
    @Inject(PLATFORM_ID) private platformId
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.authService.autoLogin();
      document.body.style.overflow = 'hidden';
      this.loadComponent = true;

      setTimeout(() => {
        if (document.body.hasAttribute('style')) {
          document.body.removeAttribute('style');
        }
        this.loaded = true;
      }, 3000);
    }
  }
}
