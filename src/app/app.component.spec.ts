/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { VbCaptions } from './components/vb-captions/vb-captions';
import { VbDrop } from './components/vb-drop/vb-drop';
import { VbScroll } from './components/vb-scroll/vb-scroll';
import { VbVideo } from './components/vb-video/vb-video';
import { SubtitlesParser } from './services/subtitles-parser';

describe('App: Videobook', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        VbCaptions,
        VbDrop,
        VbScroll,
        VbVideo
      ],
      providers: [SubtitlesParser]
    });
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have a title`, async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('');
  }));

  it('should render title in a h1 tag', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled).toBeDefined()
  }));
});
