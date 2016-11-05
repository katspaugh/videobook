import {Component, Input, Output, EventEmitter, ElementRef} from '@angular/core';

@Component({
  selector: 'vb-captions',
  styleUrls: [ './vb-captions.css' ],
  templateUrl: './vb-captions.html'
})
export class VbCaptions {
  lastActive = null;
  currentActive = null;

  @Input() captions: any[];
  @Output() captionSelect: EventEmitter<{}> = new EventEmitter();

  @Input()
  set activeCaption(caption) {
    this.lastActive = caption ? null : this.currentActive;
    this.currentActive = caption;
  }
  get activeCaption() { return this.currentActive; }

  constructor(private element: ElementRef) {}

  selectCaption(caption) {
    this.captionSelect.next({
      caption: caption
    });
  }

  isPrevActive(caption) {
    return this.lastActive && (this.lastActive.id == caption.id);
  }

  isActive(caption) {
    return this.currentActive && (this.currentActive.id == caption.id);
  }
}
