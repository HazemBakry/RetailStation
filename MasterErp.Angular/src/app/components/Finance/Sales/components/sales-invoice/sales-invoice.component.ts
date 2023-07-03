import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'app-sales-invoice',
  templateUrl: './sales-invoice.component.html',
  styleUrls: ['./sales-invoice.component.css']
})
export class SalesInvoiceComponent implements OnInit {
  SalesList: any[] = [];
  showLoader: boolean;

  constructor(private salesService: SalesService) { }

  ngOnInit(): void {
    this.GetSalesInvoiceData();
  }

  GetSalesInvoiceData() {
    this.salesService.GetSalesInvoiceData().subscribe(data => {
      this.SalesList = data;
    });
  }

}
