
import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-suppliers-account-statement',
  templateUrl: './suppliers-account-statement.component.html',
  styleUrls: ['./suppliers-account-statement.component.css']
})

export class SuppliersAccountStatementComponent implements OnInit {
  PurchaseList: any[] = [];
  showLoader: boolean;


  SuppliersList: any[] = [];
  SupplierId: any;
  SupplierName = 'الموردين';

  constructor(private purchaseService: PurchaseService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.GetSuppliersData();
  }
  GetSuppliersData() {
    this.purchaseService.GetSuppliersData().subscribe(data => {
      this.SuppliersList = data;
    });
  }
  GetSelectedSupplier(item: any) {
    this.SupplierId = item.supplierID;
  }
  loadData() {
    if (!this.SupplierId) {
      this.toaster.warning('يرجى اختيار مورد');
    }
    this.purchaseService.GetSupplierStatementData(this.SupplierId).subscribe(data => {
      this.PurchaseList = data;
    })
  }



}
