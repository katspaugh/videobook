import { Directive, ElementRef, Input } from '@angular/core';

@Directive({ selector: '[vbScroll]' })
export class VbScroll {
  private el;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  @Input('vbScroll')
  set isActive(toggle) {
    toggle && this.scroll();
  }

  scroll() {
    this.el.scrollIntoViewIfNeeded ?
      this.el.scrollIntoViewIfNeeded() :
      this.el.scrollIntoView({ behavior: 'smooth' });
  }
}
