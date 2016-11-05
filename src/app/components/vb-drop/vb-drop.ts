import {Component, Input, Output, EventEmitter} from '@angular/core';
import {SubtitlesParser} from '../../services/subtitles-parser';

@Component({
  selector: 'vb-drop',
  styleUrls: [ './vb-drop.css' ],
  templateUrl: './vb-drop.html'
})
export class VbDrop {
  @Input() url: string;
  @Output() uploadVideo: EventEmitter<{}> = new EventEmitter();
  @Output() uploadCaptions: EventEmitter<{}> = new EventEmitter();

  isDragover = false;
  prevVideoUrl = null;

  constructor(private subParser: SubtitlesParser) {}

  private isCaptions(file) {
    return /\.(vtt|srt|ass|ssa)$/.test(file.name);
  }

  private loadCaptions(file) {
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      let vtt = this.subParser.toVTT(e.target['result']);
      this.uploadCaptions.next({
        url: 'data:text/vtt;charset=utf-8,' + encodeURIComponent(vtt)
      });
    };
  }

  private loadVideo(file) {
    if (this.prevVideoUrl) {
      URL.revokeObjectURL(this.prevVideoUrl);
    }

    this.prevVideoUrl = URL.createObjectURL(file);
    this.uploadVideo.next({
      url: this.prevVideoUrl,
      type: file.type,
      name: file.name
    });
  }

  private stopEvent(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  onDragover(e) {
    this.stopEvent(e);
    this.isDragover = true;
  }

  onDragleave(e) {
    this.stopEvent(e);
    this.isDragover = false;
  }

  onDrop(e) {
    this.stopEvent(e);
    this.isDragover = false;

    Array.prototype.forEach.call(e.dataTransfer.files, (file) => {
      this.isCaptions(file) ? this.loadCaptions(file) : this.loadVideo(file);
    });
  }
}
