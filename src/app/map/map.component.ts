import {
  Component,
  ElementRef,
  EventEmitter,
  Input, OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { MapService } from './map.service';

export interface Coordinates {
  lat: number;
  lng: number;
  accuracy?: number;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Output() coordinateGenerated = new EventEmitter<Coordinates>();
  @Input() student: boolean = false;

  @ViewChild('map') mapEl: ElementRef<HTMLDivElement>;
  map: google.maps.Map;
  isLoading: boolean = false;
  isLoading2: boolean = false;
  error: string;
  success: boolean = false;

  constructor(
    private mapService: MapService,
  ) {}
  coordinates: Coordinates;

  ngOnInit(): void {
    if (this.student) {
      this.autoLocate();
    }

    this.mapService.error.subscribe((error) => {
      if (
        error != 'Some fields are not in record!' &&
        error != 'Some fields are invalid!' &&
        error != 'One attendance per day, for a course!'
      ) {
        console.log(error);
        this.error = error;
        this.isLoading2 = false;
      }
    });
  }

  onAutoComplete(input: HTMLInputElement) {
    this.mapService.autoComplete(input);
  }

  tryAgain() {
    this.success = false;
  }

  autoLocate() {
    if (!navigator.geolocation) {
      alert(
        'Location feature is not available on your browser - please use a more modern one',
      );
      return;
    }
    this.isLoading = true;
    return navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const crd = pos.coords;

        const coordinate: Coordinates = {
          lat: crd.latitude,
          lng: crd.longitude,
          accuracy: crd.accuracy,
        };

        if (coordinate.accuracy > 100) {
          this.error =
            'Your location is inaccurate! This might be due to a network issue';
          this.isLoading = false;
          return;
        }

        this.coordinates = coordinate;
        await this.render(this.mapEl.nativeElement);
        console.log(JSON.stringify(coordinate));
        this.isLoading = false;
      },
      (err) => {
        this.error =
          'Could not locate you unfortunately. Please enter an address manually';
        this.isLoading = false;
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    );
  }

  render(map: HTMLDivElement) {
    this.map = new google.maps.Map(map, {
      center: this.coordinates,
      zoom: 18,
    });

    new google.maps.Marker({
      position: this.coordinates,
      map: this.map,
    });

    this.success = true;
  }

  findAddressHandler(input: HTMLInputElement) {
    this.isLoading = true;
    if (input.value.trim() == '') {
      throw new Error('Form input field is empty');
    }

    this.mapService.getCoordsFromAddress(input.value).subscribe({
      next: async (res) => {
        if (!res['lat']) {
          this.isLoading = false;
          this.error = 'Enter a more precise address!';
          return;
        }

        this.coordinates = res;
        await this.render(this.mapEl.nativeElement);
        this.isLoading = false;
        this.error = '';
      },
      error: (err) => {
        this.isLoading = false;

        if (err['message']) {
          this.error = err.message;
          return;
        }

        this.error = 'Invalid address. try making it more precise!';
      },
    });
  }

  onSubmit() {
    this.isLoading2 = true;
    this.coordinateGenerated.emit(this.coordinates);
  }

}
