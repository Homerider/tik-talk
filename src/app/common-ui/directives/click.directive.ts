import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
  selector: '[appClick]',
  standalone: true
})
export class ClickDirective {

  private originalSrc: string = '/assets/svg/logo-small.svg';
  private newSrc: string = '/assets/imgs/pashalka.png';
  private isOriginal: boolean = true;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.originalSrc = this.el.nativeElement.src;
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.renderer.addClass(this.el.nativeElement, 'pulse');

    if (this.isOriginal) {
      this.renderer.setAttribute(this.el.nativeElement, 'src', this.newSrc);
    } else {
      this.renderer.setAttribute(this.el.nativeElement, 'src', this.originalSrc);
    }
    this.isOriginal = !this.isOriginal;

    setTimeout(() => {
      this.renderer.removeClass(this.el.nativeElement, 'pulse');
    }, 500)
  }
}
