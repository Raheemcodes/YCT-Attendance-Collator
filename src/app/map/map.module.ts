import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MapComponent } from './map.component';



@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [MapComponent]
})
export class MapModule { }
