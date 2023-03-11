import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedService } from '../shared/shared.service';
import { environment } from './../../environments/environment';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('loginTitle') loginTitle: ElementRef<HTMLElement>;
  @ViewChild('signupTitle') signupTitle: ElementRef<HTMLElement>;
  @ViewChild('underline') underline: ElementRef<HTMLHRElement>;
  @ViewChild('formContainer') formContainer: ElementRef<HTMLDivElement>;
  error: any;
  signedup: boolean = false;
  isLoading: boolean = false;
  isBio: boolean = false;
  userSub: Subscription;
  isAuthenticated: boolean = false;
  signupTimeout: any;
  loginTimeout: any;
  clientId: string = environment.clientId;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    shredService: SharedService,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId
  ) {
    shredService.setMeta({
      title: 'YCT Attendance Collator',
      description: 'YCT attendance Collator Auth Page.',
      keywords: 'YCT, Yabatech',
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userSub = this.authService.user.subscribe((user) => {
        if (!!user) {
          this.router.navigate(['/']);
        }
      });

      if (location.pathname == '/signup') {
        this.signupControl();
      }

      this.authService.sucessMessage.subscribe((success) => {
        if (!!success) {
          if (location.pathname == '/signup') {
            this.signedup = false;
            this.loginControl();
          } else {
            this.router.navigate(['../'], { relativeTo: this.route });
          }
        }
      });

      this.authService.errorMessage.subscribe((error) => {
        console.log(error);
        this.error = error;
        this.isLoading = false;
        this.isBio = false;
      });
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) this.load();
  }

  load() {
    const btns: NodeListOf<HTMLButtonElement> =
      document.querySelectorAll('.google-login__btn');

    google.accounts.id.initialize({
      client_id: environment.clientId,
      callback: this.onGoogleAuth.bind(this),
    });

    btns.forEach((btn) => {
      google.accounts.id.renderButton(
        btn,
        {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
        } // customization attributes
      );
    });

    google.accounts.id.prompt();
  }

  onLogin(form: NgForm) {
    if (this.isBio) return;
    this.isLoading = true;

    if (!form.valid) {
      this.error = 'invalid form';
      this.isLoading = false;
      this.isBio = false;
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    this.authService.login(email, password).subscribe({
      next: (resData) => {
        this.isLoading = false;
        this.isBio = false;
        form.reset();
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (errorMessage) => {
        this.error = errorMessage;
        this.isLoading = false;
        this.isBio = false;
      },
    });
  }

  onSignup(form: NgForm) {
    this.isLoading = true;
    if (!form.valid) {
      this.error = 'invalid form';
      this.isLoading = false;
      this.isBio = false;
      return;
    }
    const email: string = form.value.email;
    const password: string = form.value.password;
    const confirmPassword: string = form.value.confirmPassword;
    const fullName: string = form.value.fullName;
    this.authService
      .signup(email, fullName, password, confirmPassword)
      .subscribe({
        next: (resData) => {
          this.isLoading = false;
          this.isBio = false;
          form.reset();
          this.signedup = true;
        },
        error: (errorMessage: any) => {
          this.error = errorMessage;
          this.isLoading = false;
          this.isBio = false;
        },
      });
  }

  onGoogleAuth(response: google.accounts.id.CredentialResponse) {
    if (!this.isLoading) {
      this.isLoading = true;

      const { credential } = response;

      setTimeout(() => {
        this.authService.googleAuth(credential).subscribe({
          next: (resData) => {
            this.isLoading = false;

            this.router.navigate(['../'], { relativeTo: this.route });
            console.log(resData);
          },
          error: (errorMessage) => {
            this.isLoading = false;
            this.error = errorMessage;
          },
        });
      }, 5000);
    }
  }

  webauthnLogin(form: NgForm) {
    if (this.isLoading) return;
    this.isBio = true;
    this.authService.webauthnLogin(form.value.email).subscribe({
      next: () => console.log('Verifying...'),
      error: (err) => {
        if (err) {
          console.log(err);
          this.error =
            err.toString().length > 40
              ? 'Operation timed out or not allowed'
              : err;
          this.isLoading = false;
          this.isBio = false;
        }
      },
    });
  }

  signupControl() {
    if (this.loginTimeout) clearTimeout(this.loginTimeout);
    setTimeout(() => {
      this.renderer.setStyle(
        this.underline.nativeElement,
        'transform',
        'translateX(100%)'
      );
      this.renderer.setStyle(
        this.formContainer.nativeElement,
        'transform',
        'translateX(-50%)'
      );
      this.renderer.removeClass(this.loginTitle.nativeElement, 'active');
      this.renderer.addClass(this.signupTitle.nativeElement, 'active');
      this.router.navigate(['signup']);
    }, 1);
  }

  loginControl() {
    if (this.signupTimeout) clearTimeout(this.signupTimeout);
    this.renderer.addClass(this.loginTitle.nativeElement, 'active');
    this.renderer.removeClass(this.signupTitle.nativeElement, 'active');
    this.renderer.setStyle(
      this.underline.nativeElement,
      'transform',
      'translateX(0)'
    );
    this.renderer.setStyle(
      this.formContainer.nativeElement,
      'transform',
      'translateX(0)'
    );
    this.loginTimeout = setTimeout(() => {
      this.router.navigate(['login']);
    }, 500);
  }

  previousPage() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userSub.unsubscribe();
      if (this.signupTimeout) clearTimeout(this.signupTimeout);
      if (this.loginTimeout) clearTimeout(this.loginTimeout);
    }
  }
}
