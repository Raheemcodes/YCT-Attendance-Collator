import { ValidateEqualModule } from 'ng-validate-equal';
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CredComponent } from './cred/cred.component';

import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AuthComponent } from './auth.component';

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
