import { AuthGuard } from './../../auth/auth.guard';
import { AttendanceResolver } from './../attendance.resolver';
import { AttendanceRecordsComponent } from './attendance-records.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AttendanceRecordsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: AttendanceRecordsComponent,
        resolve: [AttendanceResolver],
        canActivate: [AuthGuard],
      },
    ]),
  ],
})
export class AttendanceRecordsModule {}
