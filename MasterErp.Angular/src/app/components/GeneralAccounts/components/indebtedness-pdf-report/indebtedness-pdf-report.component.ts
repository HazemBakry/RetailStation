import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as domToPdf from 'dom-to-pdf';


@Component({
  selector: 'app-indebtedness-pdf-report',
  templateUrl: './indebtedness-pdf-report.component.html',
  styleUrls: ['./indebtedness-pdf-report.component.css']
})
export class IndebtednessPdfReportComponent implements OnInit {
  @ViewChild('printSection') printSectionRef: ElementRef;
  TitleList = ['الحسابات العامة', 'مديونية الشركة'];
  IndebtednessData: any[] = [];
  valueKeys: any[] = [
    { key: 'مديونية الموردين', value1: 0, value2: 0, diff: 0 },
    { key: 'ايجارات الشركة', value1: 0, value2: 0, diff: 0 },
    { key: 'ايجارات مشوار', value1: 0, value2: 0, diff: 0 },
    { key: 'التامينات الاجتماعية', value1: 0, value2: 0, diff: 0 },
    { key: 'رواتب شهر 12/24', value1: 0, value2: 0, diff: 0 },
    { key: 'رواتب شهر 1/25', value1: 0, value2: 0, diff: 0 },
    { key: 'مديونية مشوار للعقارات', value1: 0, value2: 0, diff: 0 }
  ];
  header1: any;
  header2: any;
  TotalValue: number = 0;
  TotalDiffValue: number = 0;
  isPrinting = false;

  constructor(private toaster: ToastrService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  calculateTotal(item: any) {
    item.diff = 0;
    this.TotalValue = this.valueKeys.reduce((total, item) => {
      return total + (+item.value1 || 0) + (+item.value2 || 0);
    }, 0);

    item.diff = (+item.value1 || 0) - (+item.value2 || 0);
    this.TotalDiffValue = this.valueKeys.reduce((total, item) => {
      return total + (+item.value1 || 0) - (+item.value2 || 0);
    }, 0);
  }

  printData() {
    if (!this.header1 && !this.header2) {
      this.toaster.warning('يرجى إدخال التاريخ', 'خطأ');
      return;
    }
    this.isPrinting = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      const element = this.printSectionRef.nativeElement;
      const options = {
        overrideWidth: 800,
        overrideHeight: 1120,
        filename: 'PrintViewer.pdf',
        jsPDF: {
          orientation: 'portrait',
          unit: 'px',
          format: 'a4',
        },
        margin: { top: 20, right: 20, bottom: 20, left: 20 }
      };
      (domToPdf as any)(element, options, (pdf: any) => {
        this.isPrinting = false;
        this.cdr.detectChanges();
        // const blob = pdf.output('blob');
        // const url = URL.createObjectURL(blob);
        // window.open(url, '_blank');
      });
    }, 100);
  }
}

