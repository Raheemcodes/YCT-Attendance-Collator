import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './../auth/auth.guard';
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
            loadChildren: () =>
              import('./details/details.module').then((m) => m.DetailsModule),
          },
        ],
      },
    ]),
  ],
})
export class ProfileModule {}
