import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'aggregate-records',
    loadChildren: () =>
      import('./profile/aggregate-records/aggregate-records.module').then(
        (m) => m.AggregateRecordsModule,
      ),
  },
  {
    path: 'details',
    loadChildren: () =>
      import('./profile/details/details.module').then(
        (m) => m.DetailsModule,
      ),
  },
  {
    path: 'graph',
    loadChildren: () =>
      import('./profile/graph/graph.module').then((m) => m.GraphModule),
  },
  {
    path: 'sessions',
    loadChildren: () =>
      import('./attendance/session/session.module').then(
        (m) => m.SessionModule,
      ),
  },
  {
    path: 'mark-attendance',
    loadChildren: () =>
      import('./attendance/mark-attendance/mark-attendance.module').then(
        (m) => m.MarkAttendanceModule,
      ),
  },
  {
    path: 'programmes/:year',
    loadChildren: () =>
      import('./attendance/programmes/programmes.module').then(
        (m) => m.ProgrammesModule,
      ),
  },
  {
    path: 'programmes/:year/:progId/:courseId',
    loadChildren: () =>
      import('./attendance/attendance-records/attendance-records.module').then(
        (m) => m.AttendanceRecordsModule,
      ),
  },
  {
    path: 'aggregate/:sessionId/:progId/:courseId',
    loadChildren: () =>
      import('./attendance/aggregate/aggregate.module').then(
        (m) => m.AggregateModule,
      ),
  },
  {
    path: 'programmes/:year/:progId/:courseId/:recordId',
    loadChildren: () =>
      import('./attendance/record/record.module').then((m) => m.RecordModule),
  },
  {
    path: 'attendance/:userId/:year/:progId/:courseId/:recordId/:token',
    loadChildren: () =>
      import('./attendance/student-attendance/student-attendance.module').then(
        (m) => m.StudentAttendanceModule,
      ),
  },
  {
    path: 'create-record',
    loadChildren: () =>
      import('./attendance/create-record/create-record.module').then(
        (m) => m.CreateRecordModule,
      ),
  },
  {
    path: 'not-found',
    component: PageNotFoundComponent,
  },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      preloadingStrategy: PreloadAllModules,
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
