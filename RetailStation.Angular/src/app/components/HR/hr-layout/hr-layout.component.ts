import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { GoogleChartsModule } from 'angular-google-charts';

@Component({
  selector: 'app-hr-layout',
  templateUrl: './hr-layout.component.html',
  styleUrls: ['./hr-layout.component.css']
})
export class HrLayoutComponent implements OnInit {

  isToggle = false;

  onToggleContent() {
    this.isToggle = !this.isToggle;
    const htmlElement = document.querySelector('html');
    if (this.isToggle) {
      htmlElement.style.cssText = `overflow: hidden`;
    } else {
      htmlElement.style.cssText = `overflow: auto`;
    }
  }

  onOverlayClicked() {
    this.isToggle = false;
    const htmlElement = document.querySelector('html');
    htmlElement.style.cssText = `overflow: auto`;
  }

  constructor() { }

  ngOnInit(): void { }




}
