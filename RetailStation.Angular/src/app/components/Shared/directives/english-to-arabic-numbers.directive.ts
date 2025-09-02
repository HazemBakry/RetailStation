import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appNumbers]'
})
export class EnglishToArabicNumbersDirective {

  @Input() value: string | number = '';

  private arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

  constructor(private el: ElementRef) {}

  ngOnChanges() {
    if (this.value) {
      this.el.nativeElement.innerText = this.value
        .toString()
        .replace(/\d/g, (digit) => this.arabicNumbers[parseInt(digit)]);
    }
  }

}
