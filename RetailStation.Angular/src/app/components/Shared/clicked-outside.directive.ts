import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  OnDestroy,
  Directive,
  ElementRef,
  Inject,
  Output,
  EventEmitter,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[clickedOutsideElement]',
})
export class ClickedOutsideDirective implements AfterViewInit, OnDestroy {
  @Output() clickOutside = new EventEmitter<void>();
  documentClickedSubscription: Subscription;

  constructor(
    private ele: ElementRef,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngAfterViewInit(): void {
    this.documentClickedSubscription = fromEvent(this.document, 'click')
      .pipe(
        filter((event) => {
          return !this.isInside(event.target as HTMLElement);
        })
      )
      .subscribe(() => {
        this.clickOutside.emit();
      });
  }

  isInside(elementToCheck: HTMLElement): boolean {
    return (
      elementToCheck === this.ele.nativeElement ||
      this.ele.nativeElement.contains(elementToCheck)
    );
  }

  ngOnDestroy(): void {
    this.documentClickedSubscription.unsubscribe();
  }
}
