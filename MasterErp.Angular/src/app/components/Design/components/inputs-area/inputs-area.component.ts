import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inputs-area',
  templateUrl: './inputs-area.component.html',
  styleUrls: ['./inputs-area.component.css'],
})
export class InputsAreaComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  inputDropdownValue = '';
  inputDropdownValue_2 = '';

  isFocused = false;

  paymentList: string[] = [
    'مشروع البنك',
    'نقدي',
    'شيك',
    'بطاقة إئتمان',
    'تحويل على الهواء',
  ];

  onChoosePayment(payment: string) {
    this.inputDropdownValue = payment;
  }
  onChoosePayment_2(payment: string) {
    this.inputDropdownValue_2 = payment;
  }

  tableRows = [];

  onAddRow() {
    this.tableRows.push({
      isChecked: false,
      number: 1,
      typeHead: '-',
      accountHead: '-',
      taxRate: 0.0,
      amount: '0.00 ج.م',
      total: '0.00 ج.م',
    });
  }
}
