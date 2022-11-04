import { Student } from '../../../../src/app/map/student.model';
export interface Session {
  _id: string;
  title: string;
  programmes: Programme[];
}

export interface Programme {
  _id: string;
  title: string;
  courses: Course[];
}

export interface Course {
  _id: string;
  title: string;
  students: Student[];
  attendanceRecords?: AttendanceRecord[];
  aggregateAttendance?: AggregateAttendanceLine[];
}

export interface AttendanceRecord {
  _id: string;
  date: any;
  token: string;
  coordinates: { lat: number; lng: number };
  tokenResetExpiration: string;
  attendance: AttendanceLine[];
}

export interface AttendanceLine {
  _id: string;
  name: string;
  matricNumber: string;
  isRegistered: boolean;
  status: string;
}

export interface AggregateAttendanceLine {
  _id: string;
  name: string;
  matricNumber: string;
  timesPresent: number;
}
