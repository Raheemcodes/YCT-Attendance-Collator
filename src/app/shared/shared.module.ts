import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoaderComponent } from './loader/loader.component';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [ModalComponent, LoaderComponent],
  imports: [CommonModule],
  exports: [ModalComponent, LoaderComponent],
})
export class SharedModule {}
