import { SharedModule } from 'src/app/shared/shared.module';
import { AuthGuard } from './../../auth/auth.guard';
import { RecordComponent } from './record.component';
import { AttendanceResolver } from './../attendance.resolver';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [RecordComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: RecordComponent,
        resolve: [AttendanceResolver],
        canActivate: [AuthGuard],
      },
    ]),
  ],
})
export class RecordModule {}
