import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';

@Component({
  selector: 'app-purchase-invoice',
  templateUrl: './purchase-invoice.component.html',
  styleUrls: ['./purchase-invoice.component.css']
})
export class PurchaseInvoiceComponent implements OnInit {
  PurchaseList: any[] = [];
  showLoader: boolean;

  constructor(private purchaseService: PurchaseService) { }

  ngOnInit(): void {
    this.GetPurchaseInvoiceData();
  }

  GetPurchaseInvoiceData() {
    this.purchaseService.GetPurchaseInvoiceData().subscribe(data => {
      this.PurchaseList = data;
    })
  }

}
