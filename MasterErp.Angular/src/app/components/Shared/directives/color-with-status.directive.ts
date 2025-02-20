import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appColorWithStatus]'
})
export class ColorWithStatusDirective implements OnInit {

  @Input() status:string='';
  @Input() text?:any=null;
  constructor(private elem: ElementRef,  private renderer: Renderer2) {}
  ngOnInit(): void {
    this.checkStatus()
  }

  checkStatus()
  {
    if (this.status&& this.status == 'entryStatus') {
      if (this.text) {
        switch (this.text) {
          case 'true':
            this.renderer.setAttribute(this.elem.nativeElement, 'class', 'status-box green');
            // this.elem.nativeElement.innerHTML = this.status + '&nbsp;<i class="fas fa-check"></i>';
            var div = this.renderer.createElement('div');
              this.renderer.addClass(div, 'ms-2');
              var text = this.renderer.createText(this.text);
              this.renderer.appendChild(div, text);
              this.renderer.appendChild(this.elem.nativeElement, div);
            break;
        
            case 'false':
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
    else if (this.status && this.status.toLowerCase() == 'isapproved') {
      var label='';
      var style='gray'
      if (this.text == true) {
        label='مقبول';
        style='green';
      }
      else if (this.text == false) {
        label='ملغي';
        style='red';
      }
      else {
        label='غير معروف';
        style='orange';
      }

      this.renderer.setAttribute(this.elem.nativeElement, 'class', 'status-box text-nowrap '+style);
      var div = this.renderer.createElement('div');
      // this.renderer.addClass(div, 'ms-2');
      var text = this.renderer.createText(label);
      this.renderer.appendChild(div, text);
      this.renderer.appendChild(this.elem.nativeElement, div);

    }
    else if (this.status&&this.status=='receiptsStatus') {
      // if (this.text) {
        switch (this.text) {
          case '':
            this.renderer.setAttribute(this.elem.nativeElement, 'class', 'bg-success-gradient w-icon');
            break;
          case 'y':
            this.renderer.setAttribute(this.elem.nativeElement, 'class', 'bg-warning-gradient w-icon');
          
            break;
          default:
            this.renderer.setAttribute(this.elem.nativeElement, 'class', 'bg-secondary-gradient w-icon');

            break;
        }
        this.elem.nativeElement.innerHTML = '&nbsp;<i class="fas fa-chart-pie"></i>';


      // }
    }
  }

  
}
