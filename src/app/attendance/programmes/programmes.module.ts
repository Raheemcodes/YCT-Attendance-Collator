import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'yct-attendance-collator/src/app/shared/shared.module';
import { AuthGuard } from './../../auth/auth.guard';
import { AttendanceResolver } from './../attendance.resolver';
import { ProgrammesComponent } from './programmes.component';

@NgModule({
  declarations: [ProgrammesComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProgrammesComponent,
        resolve: [AttendanceResolver],
        canActivate: [AuthGuard],
      },
    ]),
  ],
})
export class ProgrammesModule {}
