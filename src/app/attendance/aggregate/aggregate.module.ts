import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './../../auth/auth.guard';
import { AttendanceResolver } from './../attendance.resolver';
import { AggregateComponent } from './aggregate.component';

@NgModule({
  declarations: [AggregateComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: AggregateComponent,
        resolve: [AttendanceResolver],
        canActivate: [AuthGuard],
      },
    ]),
  ],
})
export class AggregateModule {}
