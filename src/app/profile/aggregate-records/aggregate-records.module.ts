import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { AttendanceResolver } from './../../attendance/attendance.resolver';
import { AuthGuard } from './../../auth/auth.guard';
import { AggregateRecordsComponent } from './aggregate-records.component';



@NgModule({
  declarations: [AggregateRecordsComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: AggregateRecordsComponent,
        resolve: [AttendanceResolver],
        canActivate: [AuthGuard],
      },
    ]),
  ],
})
export class AggregateRecordsModule { }
