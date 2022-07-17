import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './../../auth/auth.guard';
import { AttendanceResolver } from './../attendance.resolver';
import { CreateRecordComponent } from './create-record.component';

@NgModule({
  declarations: [CreateRecordComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: CreateRecordComponent,
        resolve: [AttendanceResolver],
        canActivate: [AuthGuard],
      },
    ]),
  ],
})
export class CreateRecordModule {}
