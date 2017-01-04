import {Component, Input, Output, EventEmitter, ElementRef, HostListener} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'vb-video',
  styleUrls: [ './vb-video.css' ],
  templateUrl: './vb-video.html'
})
export class VbVideo {
  private captionTracks = [];
  private activeCaption;
  private prevActiveCaption;
  private videoElement: HTMLVideoElement;
  displayedText: string = '';

  constructor(private sanitizer: DomSanitizer, private element: ElementRef) {}

  ngAfterViewInit() {
    this.videoElement = this.element.nativeElement.querySelector('video');
  }

  // Video URL
  @Input()
  set videoUrl(url) {
    if (this.videoElement) {
      this.videoElement.src = url;
    }
  }
  get videoUrl() { return this.videoElement ? this.videoElement.src : ''; }

  // Current time
  @Input()
  set currentTime(time) {
    if (this.videoElement && time != null) {
      this.videoElement.currentTime = time;
      this.videoElement.play();
    }
  }
  get currentTime() { return this.videoElement ? this.videoElement.currentTime : 0; }

  // Captions URL
  @Input()
  set captionsUrl(url) {
    this.captionTracks = [];
    this.captionTracks.push({
      url: this.sanitizer.bypassSecurityTrustResourceUrl(url)
    });
  }
  get captionsUrl() {
    return this.captionTracks[0] ? this.captionTracks[0].url : null;
  }

  // Output stream
  @Output() videoStream: EventEmitter<{}> = new EventEmitter();

  @HostListener('document:keydown', [ '$event' ])
  onKeyup($event) {
    switch ($event.code) {
    case 'Space':
      $event.preventDefault();
      return this.playPause();
    case 'Enter':
      $event.preventDefault();
      return this.replayCaption();
    case 'ArrowLeft':
    case 'ArrowUp':
      $event.preventDefault();
      return this.nextCaption(-1);
    case 'ArrowDown':
    case 'ArrowRight':
      $event.preventDefault();
      return this.nextCaption(1);
    }
  }

  private playPause() {
    this.videoElement.paused ? this.videoElement.play() : this.videoElement.pause();
  }

  private playCaption(caption) {
    if (!caption) return;
    this.videoElement.currentTime = caption.startTime;
    this.videoElement.play();
  }

  private replayCaption() {
    let track = this.getTrack();
    if (!track) return;
    this.playCaption(this.activeCaption || this.prevActiveCaption || track.cues[0]);
  }

  private nextCaption(delta) {
    let track = this.getTrack();
    if (!track) return;

    let active = this.activeCaption || this.prevActiveCaption;
    if (!active) return this.playCaption(track.cues[0]);

    let index = Array.prototype.indexOf.call(track.cues, active);
    let next = track.cues[index + delta];

    this.playCaption(next);
  }

  private getCaption(cue) {
    let caption = {
      id: cue.id,
      startTime: cue.startTime,
      endTime: cue.endTime,
      text: cue.text.replace(/\n/g, '<br>')
    };
    if (!caption.id) {
      delete caption.id;
      caption.id = JSON.stringify(caption);
    }
    return caption;
  }

  private getTrack() {
    let tracks = this.videoElement.textTracks;
    let track = tracks && tracks[0];

    if (!track) return null;

    // Hide the built-in captions
    track.mode = 'hidden';

    return track;
  }

  captionsOnLoad() {
    this.activeCaption = null;
    this.prevActiveCaption = null;

    let track = this.getTrack();
    if (!track) return;

    this.videoStream.next({
      event: 'captionsReady',
      captions: Array.prototype.map.call(track.cues, this.getCaption, this)
    });
  }

  captionsOnCuechange() {
    if (this.activeCaption) this.prevActiveCaption = this.activeCaption;
    this.activeCaption = null;

    let track = this.getTrack();
    if (!track) return;

    let activeCue = track.activeCues[0];
    let transformedCaption = null;

    if (activeCue) {
      this.activeCaption = activeCue;
      transformedCaption = this.getCaption(activeCue);

      if (transformedCaption.text) this.displayedText = transformedCaption.text;
    }

    this.videoStream.next({
      event: 'captionChange',
      activeCaption: transformedCaption
    });
  }
}
