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
    { key: 'SuppliersDebts', displayText: 'مديونية الموردين', value1: 0, value2: 0, diff: 0 },
    { key: 'CompanyRentals', displayText: 'ايجارات الشركة', value1: 0, value2: 0, diff: 0 },
    { key: 'MishwarRentals', displayText: 'ايجارات مشوار', value1: 0, value2: 0, diff: 0 },
    { key: 'SocialInsurance', displayText: 'التامينات الاجتماعية', value1: 0, value2: 0, diff: 0 },
    { key: 'MonthlySalary', displayText: 'رواتب شهر ', value1: 0, value2: 0, diff: 0, notes: '' },
    { key: 'MonthlySalary2', displayText: 'رواتب شهر ', value1: 0, value2: 0, diff: 0, notes: '' },
    { key: 'MishwarRealStatesDebts', displayText: 'مديونية مشوار للعقارات', value1: 0, value2: 0, diff: 0 },
    { key: 'TotalDebts', displayText: 'إجمالى المديونية', value1: 0, value2: 0, diff: 0 },
  ];
  valueKeys2: any[] = [
    { key: 'Revenues', displayText: 'إيرادات مستحقة', value1: 0, value2: 0, diff: 0 },
    { key: 'Stock', displayText: 'رصيد المخزون', value1: 0, value2: 0, diff: 0 },
    { key: 'TotalValue', displayText: 'الإجمالى', value1: 0, value2: 0, diff: 0 },
  ];
  totalValueObj = { key: 'TotalValue', displayText: 'صافي المديونيه', value1: 0, value2: 0, diff: 0 };
  header1: any;
  header2: any;
  isPrinting = false;

  constructor(private toaster: ToastrService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  calculateTotalDebts() {
    this.valueKeys.forEach(i => {
      // if (+i.value1 < 0 && +i.value2 < 0) {
      //   i.diff = -(Math.abs(+i.value1) + Math.abs(+i.value2));
      // } else {
      //   i.diff = (+i.value1 || 0) - (+i.value2 || 0);
      // }
      i.diff = (i.value2 || 0) - (i.value1 || 0);
    });

    const debts = this.valueKeys.filter(i => i.key !== 'TotalDebts');
    const totalDebtsValue1 = debts.reduce((sum, i) => sum + (+i.value1 || 0), 0);
    const totalDebtsValue2 = debts.reduce((sum, i) => sum + (+i.value2 || 0), 0);
    const totalDebts = this.valueKeys.find(i => i.key === 'TotalDebts');
    if (totalDebts) {
      totalDebts.value1 = totalDebtsValue1;
      totalDebts.value2 = totalDebtsValue2;
      totalDebts.diff = totalDebtsValue2 - totalDebtsValue1;
    }
  }

  calculateTotalValue() {
    this.valueKeys2.forEach(i => {
      // if (+i.value1 < 0 && +i.value2 < 0) {
      //   i.diff = -(Math.abs(+i.value1) + Math.abs(+i.value2));
      // } else {
      //   i.diff = (+i.value1 || 0) - (+i.value2 || 0);
      // }
      i.diff = (i.value2 || 0); - (i.value1 || 0) 
    });

    const values = this.valueKeys2.filter(i => i.key !== 'TotalValue');
    const totalValue1 = values.reduce((sum, i) => sum + (+i.value1 || 0), 0);
    const totalValue2 = values.reduce((sum, i) => sum + (+i.value2 || 0), 0);
    const totalValue = this.valueKeys2.find(i => i.key === 'TotalValue');
    if (totalValue) {
      totalValue.value1 = totalValue1;
      totalValue.value2 = totalValue2;
      totalValue.diff = totalValue2 - totalValue1;
    }

    this.calculateNetDebt();
  }

  calculateNetDebt() {
    debugger;
    const revenues = this.valueKeys2.find(i => i.key === 'Revenues');
    const totalDebts = this.valueKeys.find(i => i.key === 'TotalDebts');
    const revenuesValue1 = revenues?.value1 || 0;
    const revenuesValue2 = revenues?.value2 || 0;
    const debtsValue1 = totalDebts?.value1 || 0;
    const debtsValue2 = totalDebts?.value2 || 0;
    this.totalValueObj.value1 = revenuesValue1 - debtsValue1;
    this.totalValueObj.value2 = revenuesValue2 - debtsValue2;
    // if (this.totalValueObj.value1 < 0 && this.totalValueObj.value2 < 0) {
    //   this.totalValueObj.diff = -(Math.abs(this.totalValueObj.value1) + Math.abs(this.totalValueObj.value2));
    // } else {
    //   this.totalValueObj.diff = this.totalValueObj.value1 - this.totalValueObj.value2;
    // }
    this.totalValueObj.diff = this.totalValueObj.value2 - this.totalValueObj.value1;
  }

  printData() {
    if (!this.header1 || !this.header2) {
      this.toaster.warning('يرجى إدخال التاريخ', 'خطأ');
      return;
    }

    if (!this.valueKeys.find(i => i.key == 'MonthlySalary')?.notes || !this.valueKeys.find(i => i.key == 'MonthlySalary2')?.notes) {
      this.toaster.warning('يرجى إدخال التاريخ لعمود رواتب الشهر', 'خطأ');
      return;
    }

    this.roundValuesToTwoDecimals();
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

  roundValuesToTwoDecimals() {
    this.valueKeys.forEach(item => {
      item.value1 = parseFloat((item.value1 || 0).toFixed(2));
      item.value2 = parseFloat((item.value2 || 0).toFixed(2));
      item.diff = parseFloat(((item.value2 || 0) - (item.value1 || 0)).toFixed(2));
    });
    this.valueKeys2.forEach(item => {
      item.value1 = parseFloat((item.value1 || 0).toFixed(2));
      item.value2 = parseFloat((item.value2 || 0).toFixed(2));
      item.diff = parseFloat(((item.value2 || 0) - (item.value1 || 0)).toFixed(2));
    });

    this.totalValueObj.value1 = parseFloat((this.totalValueObj.value1 || 0).toFixed(2));
    this.totalValueObj.value2 = parseFloat((this.totalValueObj.value2 || 0).toFixed(2));
  }
}

