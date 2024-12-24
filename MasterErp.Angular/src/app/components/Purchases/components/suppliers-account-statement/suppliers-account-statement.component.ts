
import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { ToastrService } from 'ngx-toastr';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { SharedService } from 'src/app/components/Shared/services/shared.service';


@Component({
  selector: 'app-suppliers-account-statement',
  templateUrl: './suppliers-account-statement.component.html',
  styleUrls: ['./suppliers-account-statement.component.css']
})

export class SuppliersAccountStatementComponent implements OnInit {
  suppliersSelectorData: FormDropdownModel[] = [];
  PurchaseList: any[] = [];
  showLoader: boolean;
  SuppliersList: any[] = [];
  SupplierId: any;
  SupplierName = 'الموردين';
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25
  };

  constructor(private purchaseService: PurchaseService,
    private sharedService: SharedService, 
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.loadSelectors();
  }

  loadSelectors()
  {
    this.sharedService.GetSuppliersSelector().subscribe(data => {
      this.suppliersSelectorData = data;
    });
  }

  getSelectedSupplier(supplierId)
  {
    this.SupplierId = supplierId;
  }

  getSupplierStatement() {
    if (!this.SupplierId) {
      this.toaster.warning('يرجى اختيار مورد');
    }
    this.showLoader=true;
    this.purchaseService.GetSupplierStatementData(this.SupplierId).subscribe(data => {
      this.PurchaseList = data;
      this.showLoader=false;
    },(err)=>{
      this.showLoader=false;
    },()=>{
      this.showLoader=false;
    })
  }

}

