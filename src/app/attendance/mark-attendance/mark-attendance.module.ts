import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './../../auth/auth.guard';
import { MapModule } from './../../map/map.module';
import { AttendanceResolver } from './../attendance.resolver';
import { MarkAttendanceComponent } from './mark-attendance.component';

@NgModule({
  declarations: [MarkAttendanceComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    FormsModule,
    MapModule,
    RouterModule.forChild([
      {
        path: '',
        component: MarkAttendanceComponent,
        resolve: [AttendanceResolver],
        canActivate: [AuthGuard],
      },
    ]),
  ],
})
export class MarkAttendanceModule {}
