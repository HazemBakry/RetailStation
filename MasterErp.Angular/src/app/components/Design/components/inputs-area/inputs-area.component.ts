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
