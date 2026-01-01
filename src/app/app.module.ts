import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GridCanvasComponent } from './components/grid-canvas/grid-canvas.component';

@NgModule({
  declarations: [
    AppComponent,
    GridCanvasComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
