import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-general-accounts',
  templateUrl: './general-accounts.component.html',
  styleUrls: ['./general-accounts.component.css'],
})
export class GeneralAccountsComponent implements OnInit, AfterViewInit {
  @ViewChild('chartBox') chartBox!: ElementRef<HTMLElement>;
  parentChartWidth!: number;
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

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.parentChartWidth =
      this.chartBox.nativeElement.getBoundingClientRect().width;
  }

  columnChartType = 'ColumnChart';
  columnChartData = [
    ['يناير', 600, 230],
    ['فبراير', 1170, 700],
    ['مارس', 800, 880],
    ['أبريل', 1300, 900],
    ['مايو', 400, 700],
    ['يونيو', 900, 1000],
    ['يوليو', 200, 700],
    ['أغسطس', 1200, 550],
    ['سبتمبر', 470, 789],
    ['أكتوبر', 300, 900],
    ['نوفمبر', 250, 800],
    ['ديسمبر', 500, 1100],
  ];
  columnChartNames = ['الشهور', 'النسب', 'الارقام'];
  columnChartOptions = {
    colors: ['#8dd3c7', '#fbbf72'],
    backgroundColor: 'transparent',
    chartArea: {
      width: '70%',
      backgroundColor: 'transparent',
    },
    hAxis: {
      title: 'الشهور',
    },
    vAxis: {
      title: 'النتائج',
    },
    legend: {
      // position: 'bottom',
      alignment: 'center',
    },
    isStacked: true,
  };
  columnChartWidth = (window.innerWidth * 0.95) / 1.4;
  columnChartHeight = window.innerHeight * 0.4;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.columnChartWidth = (window.innerWidth * 0.95) / 1.4;
    this.columnChartHeight = window.innerHeight * 0.4;
  }
}
