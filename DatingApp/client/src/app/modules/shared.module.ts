import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from "ngx-spinner";


@NgModule({
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    NgxGalleryModule,
    BrowserAnimationsModule,
    NgxSpinnerModule
  ],
  declarations: [],
  exports: [
    TabsModule,
    NgxGalleryModule
  ]
})
export class SharedModule { }