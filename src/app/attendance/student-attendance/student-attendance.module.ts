import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MapModule } from 'src/app/map/map.module';
import { StudentComponent } from '../student/student.component';
import { StudentAttendanceComponent } from './student-attendance.component';

@NgModule({
  declarations: [StudentAttendanceComponent, StudentComponent],
  imports: [
    CommonModule,
    MapModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: StudentAttendanceComponent },
    ]),
  ],
})
export class StudentAttendanceModule {}
