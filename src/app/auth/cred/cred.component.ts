import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-cred',
  templateUrl: './cred.component.html',
  styleUrls: ['./cred.component.scss'],
})
export class CredComponent implements OnInit {
  isLoading: boolean = false;
  success: boolean = false;
  available: boolean = true;
  error: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (window.PublicKeyCredential) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then(
        (uvpaa) => {
          if (uvpaa) {
            this.available = !!uvpaa;

            this.authService.errorMessage.subscribe((err) => {
              this.error = err;
            });
          } else {
            this.available = false;
            this.error =
            'Sorry. Your device does not support biometric authentication, kindly skip this step.';
          }
        },
      );
    } else {
      this.available = false;
      this.error =
            'Sorry. Your device does not support biometric authentication, kindly skip this step.';
    }
  }

  onBioReg() {
    this.isLoading = true;
    this.authService.webAuthnReg().subscribe({
      next: () => {
        this.isLoading = false;
        this.success = true;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err;
      },
    });
  }

  onClose() {
    this.success = false;
    this.authService.sucessMessage.next(true);
  }
}
