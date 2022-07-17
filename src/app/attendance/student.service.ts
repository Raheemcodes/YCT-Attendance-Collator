import { Coordinates } from './../map/map.component';
import { base64URLStringToBuffer } from './../auth/auth.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Subject,
  map,
  tap,
  catchError,
  switchMap,
  throwError,
} from 'rxjs';
import { bufferToBase64URLString } from '../auth/auth.service';
import { AttendanceRecord } from '../shared/shared.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  studentClose = new BehaviorSubject<boolean>(false);
  studentRecordChanged = new Subject<AttendanceRecord>();
  sucessMessage = new Subject<boolean>();
  errorMessage = new Subject<string>();
  studentAuthDetails: {
    matricNumber: string;
    isRegistered: boolean;
    sessionId: string;
    courseId: string;
    progId: string;
    recordId: string;
    attendanceId: string;
    teacherId: string;
    stautus: boolean;
    linkToken: string;
  };

  constructor(private http: HttpClient) {}

  close() {
    this.studentClose.next(false);
  }

  fetchRecord(
    userId: string,
    sessionId: string,
    progId: string,
    courseId: string,
    recordId: string,
    token: string,
    coordinates: Coordinates,
  ) {
    return this.http
      .post<{ attendanceRecord: AttendanceRecord }>(
        environment.restApiAddress + '/student/attendance',
        {
          userId,
          sessionId,
          progId,
          courseId,
          recordId,
          token,
          coordinates,
        },
      )
      .pipe(
        catchError(this.handleErrors),
        map((resData) => {
          return resData.attendanceRecord;
        }),
        tap((attendanceRecord) => {
          this.studentRecordChanged.next(attendanceRecord);
        }),
      );
  }

  webAuthnReg(
    teacherId: string,
    sessionId: string,
    progId: string,
    courseId: string,
    recordId: string,
    attendanceId: string,
    token: string,
    matricNumber: string,
  ) {
    return this.http
      .post<any>(environment.restApiAddress + '/student/webauthn-reg', {
        teacherId,
        sessionId,
        progId,
        courseId,
        matricNumber,
      })
      .pipe(
        catchError((err) => throwError(err)),
        switchMap((createCredentialDefaultArgs) => {
          const credentials: PublicKeyCredentialCreationOptions = {
            ...createCredentialDefaultArgs,
            challenge: Uint8Array.from(
              createCredentialDefaultArgs.challenge,
              (c: any) => c.charCodeAt(0),
            ),
            user: {
              ...createCredentialDefaultArgs.user,
              id: Uint8Array.from(
                atob(createCredentialDefaultArgs.user.id),
                (c: any) => c.charCodeAt(0),
              ),
            },
          };

          return navigator.credentials.create({ publicKey: credentials });
        }),
        switchMap(async (resData: any) => {
          const credential = {
            response: {
              clientDataJSON: bufferToBase64URLString(
                resData.response.clientDataJSON,
              ),
              attestationObject: bufferToBase64URLString(
                resData.response.attestationObject,
              ),
            },
          };

          this.http
            .post<{ attendanceRecord: AttendanceRecord }>(
              environment.restApiAddress + '/student/webauthn-reg-verification',
              {
                credential,
                teacherId,
                sessionId,
                progId,
                courseId,
                recordId,
                attendanceId,
                token,
              },
            )
            .pipe(catchError((err) => throwError(err)))
            .subscribe({
              next: (res) => {
                this.studentRecordChanged.next(res.attendanceRecord);
                this.sucessMessage.next(true);
              },
              error: (err) => this.errorMessage.next(err),
            });
        }),
      );
  }

  webauthnLogin(
    teacherId: string,
    sessionId: string,
    progId: string,
    courseId: string,
    recordId: string,
    attendanceId: string,
    token: string,
    status: boolean,
    matricNumber: string,
  ) {
    return this.http
      .post<any>(environment.restApiAddress + '/student/webauthn-login', {
        teacherId,
        sessionId,
        progId,
        courseId,
        matricNumber,
      })
      .pipe(
        catchError((err) => throwError(err)),
        switchMap((createCredentialDefaultArgs) => {
          const credentials: PublicKeyCredentialRequestOptions = {
            ...createCredentialDefaultArgs,
            challenge: base64URLStringToBuffer(
              createCredentialDefaultArgs.challenge,
            ),

            allowCredentials: [
              {
                ...createCredentialDefaultArgs.allowCredentials[0],
                id: base64URLStringToBuffer(
                  createCredentialDefaultArgs.allowCredentials[0].id,
                ),
              },
            ],
          };

          return navigator.credentials.get({ publicKey: credentials });
        }),
        switchMap(async (resData: any) => {
          const credential = await {
            id: resData.id,
            response: {
              authenticatorData: bufferToBase64URLString(
                resData.response.authenticatorData,
              ),
              clientDataJSON: bufferToBase64URLString(
                resData.response.clientDataJSON,
              ),
              signature: bufferToBase64URLString(resData.response.signature),
              userHandle: bufferToBase64URLString(resData.response.userHandle),
            },
          };

          this.http
            .post<{ attendanceRecord: AttendanceRecord }>(
              environment.restApiAddress +
                '/student/webauthn-login-verification',
              {
                credential,
                teacherId,
                sessionId,
                progId,
                courseId,
                recordId,
                attendanceId,
                status,
                token,
              },
            )
            .pipe(catchError((err) => throwError(err)))
            .subscribe({
              next: (res) => {
                this.studentRecordChanged.next(res.attendanceRecord);
                this.sucessMessage.next(true);
              },
              error: (err) => {
                this.errorMessage.next(err);
              },
            });
        }),
      );
  }

  private handleErrors(errorRes: HttpErrorResponse) {
    let errorMeassge = 'An unknown error occurred';

    console.log(errorRes.error);

    if (!errorRes.error) {
      return throwError(errorMeassge);
    }

    switch (errorRes.error.message) {
      case 'INVALID_LINK':
        errorMeassge = 'Your link is not valid!';
        break;

      case 'LINK_EXPIRED':
        errorMeassge = 'This link has expired or bad network!';
        break;

      case 'INVALID_DETAILS':
        errorMeassge = 'Invalid details! Try again.';
        break;

      case 'INVALID_COORD':
        errorMeassge = 'Invalid coordinates! Try again.';
        break;

      case 'INACCURATE_LOCATION':
        errorMeassge =
          'Your location is inaccurate! This might be due to your network';
        break;

      case 'RECORD_NOT_FOUND':
        errorMeassge = 'Attendance record not found';
        break;

      case 'INVALID_TOKEN':
        errorMeassge = 'Invalid token! Ensure your link is correct.';
        break;

      case 'OUT_OF_BOUND':
        errorMeassge = "You're not in class! Try contacting your teacher.";
        break;
    }

    return throwError(errorMeassge);
  }
}
