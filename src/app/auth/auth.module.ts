import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ValidateEqualModule } from 'ng-validate-equal';
import { CredComponent } from './cred/cred.component';

import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AuthComponent } from './auth.component';

@NgModule({
  declarations: [AuthComponent, CredComponent],
  imports: [
    CommonModule,
    FormsModule,

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
  providers: [],
})
export class AuthModule {}
