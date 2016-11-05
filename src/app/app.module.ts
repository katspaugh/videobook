import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { VbCaptions } from './components/vb-captions/vb-captions';
import { VbDrop } from './components/vb-drop/vb-drop';
import { VbScroll } from './components/vb-scroll/vb-scroll';
import { VbVideo } from './components/vb-video/vb-video';
import { SubtitlesParser } from './services/subtitles-parser';

@NgModule({
  declarations: [
    AppComponent,
    VbCaptions,
    VbDrop,
    VbScroll,
    VbVideo
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [SubtitlesParser],
  bootstrap: [AppComponent]
})
export class AppModule { }
