import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { AttendanceResolver } from './../../attendance/attendance.resolver';
import { AuthGuard } from './../../auth/auth.guard';
import { GraphComponent } from './graph.component';



@NgModule({
  declarations: [GraphComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: GraphComponent,
        resolve: [AttendanceResolver],
        canActivate: [AuthGuard],
      },
    ]),
  ],
})
export class GraphModule { }
