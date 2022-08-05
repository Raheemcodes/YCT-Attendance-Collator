import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  error = new Subject<any>();

  constructor(private http: HttpClient) {}

  getCoordsFromAddress(address: string) {
    const urlAddress = encodeURI(address);
    return this.http
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${urlAddress}&key=${environment.googleApi}`
      )
      .pipe(
        catchError((err) =>
          throwError(
            () => new Error('Failed to fetch coordinates. Please try again!')
          )
        ),
        map((res) => {
          if (res.results.length == 0) return res;
          const coordinate = res.results[0].geometry.location;

          return coordinate;
        })
      );
  }

  autoComplete(input: HTMLInputElement) {
    const center = { lat: 50.064192, lng: -130.605469 };
    // Create a bounding box with sides ~10km away from the center point
    const defaultBounds = {
      north: center.lat + 0.1,
      south: center.lat - 0.1,
      east: center.lng + 0.1,
      west: center.lng - 0.1,
    };

    const options = {
      bounds: defaultBounds,
      componentRestrictions: { country: 'ng' },
      fields: ['address_components', 'geometry', 'icon', 'name'],
      strictBounds: false,
    };

    new google.maps.places.Autocomplete(input, options);
  }

  handleErrors(errorRes: HttpErrorResponse) {
    let errorMeassge = 'An unknown error occurred';

    console.log(errorRes.error);

    if (!errorRes.error) {
      return errorMeassge;
    }
    switch (errorRes.error.message) {
      case 'USER_NOT_FOUND':
        errorMeassge = 'User not found! Ensure that you are logged in.';
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
    }

    return errorMeassge;
  }
}
