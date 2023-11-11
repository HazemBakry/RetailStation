import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appColorWithStatus]'
})
export class ColorWithStatusDirective implements OnInit {

  @Input() status:string='';
  @Input() text:string='';
  constructor(private elem: ElementRef,  private renderer: Renderer2) {}
  ngOnInit(): void {
    this.checkStatus()
  }

  checkStatus()
  {

    if (this.status&&this.status=='entryStatus') {
      if (this.text) {
        switch (this.text) {
          case 'مرحل':
            this.renderer.setAttribute(this.elem.nativeElement, 'class', 'status-box green');
            // this.elem.nativeElement.innerHTML = this.status + '&nbsp;<i class="fas fa-check"></i>';
            var div = this.renderer.createElement('div');
              this.renderer.addClass(div, 'ms-2');
              var text = this.renderer.createText(this.text);
              this.renderer.appendChild(div, text);
              this.renderer.appendChild(this.elem.nativeElement, div);
            break;
        
            case 'غير مرحل':
              this.renderer.setAttribute(this.elem.nativeElement, 'class', 'status-box orange');
              // this.elem.nativeElement.innerHTML = '&nbsp;<i class="fas fa-chevron-up"></i>';
              div = this.renderer.createElement('div');
              this.renderer.addClass(div, 'ms-2');
              text = this.renderer.createText(this.text);
              this.renderer.appendChild(div, text);
              this.renderer.appendChild(this.elem.nativeElement, div);
              // this.elem.nativeElement.innerText=this.text;
            break;
          default:
            break;
        }
      }
    }
  }

  
}
