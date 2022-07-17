import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './../auth/auth.guard';
import { DetailsComponent } from './details/details.component';
import { ProfileComponent } from './profile.component';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: 'details',
            component: DetailsComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
    ]),
  ]
})
export class ProfileModule {}
