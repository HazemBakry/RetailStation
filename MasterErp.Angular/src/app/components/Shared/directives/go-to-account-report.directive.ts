import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appGoToAccountReport]'
})
export class GoToAccountReportDirective {

  @Input() accountId: number;
  @Input() isGroup: boolean = true;
  constructor(private elem: ElementRef, private renderer: Renderer2) { }
  ngOnInit(): void {
    this.goToAccountReport()
  }
  goToAccountReport() {
    if (this.accountId) {
      // this.renderer.addClass(this.elem.nativeElement, 'text-underline');
      this.renderer.setStyle(this.elem.nativeElement, 'text-decoration', 'underline');
      this.renderer.addClass(this.elem.nativeElement, 'cursor-pointer');

      // Optional: add click event to open the report
      this.renderer.listen(this.elem.nativeElement, 'click', () => {
        const url = `/general-accounts/accounts-general-ledger?AccountId=${this.accountId}`;
        window.open(url, '_blank');
      });
    }
  }
}
