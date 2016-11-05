import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  videoUrl: URL = null;
  captionsUrl: string = null;
  title: string = '';
  captions: any[] = null;
  activeCaption = null;
  currentTime: number = null;
  isError: boolean = false;

  constructor() {}

  onVideoEvent(data) {
    switch (data.event) {
    case 'captionsReady':
      this.captions = data.captions;
      return;
    case 'captionChange':
      this.activeCaption = data.activeCaption;
      return;
    case 'error':
      this.isError = true;
      return;
    }
  }

  loadVideo($event) {
    this.isError = false;
    this.videoUrl = $event.url;
    this.title = $event.name.split('.').slice(0, -1);
  }

  loadCaptions($event) {
    this.captions = null;
    this.captionsUrl = $event.url;
  }

  onCaptionsSelect($event) {
    this.currentTime = $event.caption.startTime;
    setTimeout(() => {
      this.currentTime = null;
    }, 0);
  }
}
