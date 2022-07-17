import { AuthGuard } from './../../auth/auth.guard';
import { AttendanceResolver } from './../attendance.resolver';
import { SessionComponent } from './session.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [SessionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: SessionComponent,
        resolve: [AttendanceResolver],
        canActivate: [AuthGuard],
      },
    ]),
  ]
})
export class SessionModule {}
