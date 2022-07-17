import { environment } from 'src/environments/environment';
import { ValidateEqualModule } from 'ng-validate-equal';
import { SocialLoginModule, GoogleLoginProvider, SocialAuthServiceConfig } from 'angularx-social-login';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CredComponent } from './cred/cred.component';
import { AuthComponent } from './auth.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AuthComponent, CredComponent],
  imports: [
    CommonModule,
    FormsModule,
    SocialLoginModule,
    ValidateEqualModule,
    RouterModule.forChild([
      {
        path: 'login',
        component: AuthComponent,
      },
      {
        path: 'signup',
        component: AuthComponent,
      },
    ]),
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.clientId),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
})
export class AuthModule {}
