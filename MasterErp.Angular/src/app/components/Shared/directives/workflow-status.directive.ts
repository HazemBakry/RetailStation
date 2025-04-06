import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appWorkflowStatus]'
})
export class WorkflowStatusDirective implements OnInit {

  @Input() nameEN: string = '';
  @Input() nameAR: string = '';
  @Input() id?: number | null = null;

  constructor(private elem: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderStatus();
  }

  private renderStatus() {
    const text = this.nameAR || this.nameEN||'غير معروف';
    const statusColors: Record<number, { bg: string; fg: string }> = {
      7: { bg: '#FFF3CD', fg: '#856404' }, // Pending
      8: { bg: '#F8D7DA', fg: '#721C24' }, // Cancelled
      9: { bg: '#D1ECF1', fg: '#0C5460' }, // Waiting Payment
      10: { bg: '#D4EDDA', fg: '#155724' } // Paid
    };
    const defaultColors = { bg: '#E2E3E5', fg: '#383D41' };
    const colors = this.id && statusColors[this.id] ? statusColors[this.id] : defaultColors;

    // Apply styles
    const el = this.elem.nativeElement;
    this.renderer.setStyle(el, 'background-color', colors.bg);
    this.renderer.setStyle(el, 'color', colors.fg);
    this.renderer.setStyle(el, 'padding', '4px 8px');
    this.renderer.setStyle(el, 'border-radius', '4px');
    this.renderer.setStyle(el, 'display', 'inline-block');
    this.renderer.setStyle(el, 'font-weight', 'bold');
    this.renderer.setStyle(el, 'white-space', 'nowrap');

    const div = this.renderer.createElement('div');
    const textNode = this.renderer.createText(text);
    this.renderer.appendChild(div, textNode);
    this.renderer.appendChild(el, div);
  }
}
