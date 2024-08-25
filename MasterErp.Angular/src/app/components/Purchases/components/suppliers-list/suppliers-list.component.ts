import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { ToastrService } from 'ngx-toastr';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { ItemModel } from 'src/app/components/Inventory/models/Item';
import { InventoryService } from 'src/app/components/Inventory/services/inventory.service';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrls: ['./suppliers-list.component.css']
})
export class SuppliersListComponent implements OnInit {
  TitleList = ['المشتريات', 'بيانات الموردين'];
  SupplierList: any[] = [];
  supplierItems: ItemModel[] = [];
  showLoader: boolean;
  TotalCount: any;
  TotalPages: any;
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25
  };

  constructor(private purchaseService: PurchaseService, private inventoryService: InventoryService, private modalService: NgbModal, private toaster: ToastrService, private offcanvasService: NgbOffcanvas) { }

  ngOnInit(): void {
    this.GetSuppliersData();
  }


  GetSuppliersData() {
    this.showLoader = true;
    this.purchaseService.GetSuppliersData(this.FilterModel).subscribe(data => {
      this.SupplierList = data.results;
      this.TotalCount = data && data.length > 0 && (data[0].matchCount != null || data[0].matchCount != undefined) ? data[0].matchCount : 0;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }

  pageChanged(obj: any) {
    this.FilterModel.currentPage = obj.page;
    this.GetSuppliersData();
  }

  openItemsDialog(content: any, supplierId: number) {
    this.getSupplierItemsBySupplierId(supplierId);
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  openItemsSidePanel(content: any, supplierId: number) {
    this.getSupplierItemsBySupplierId(supplierId);
    this.offcanvasService.open(content, { panelClass: 'details-panel', position: 'end' });
  }

  getSupplierItemsBySupplierId(supplierId: number) {
    this.supplierItems = [];
    this.inventoryService.GetItemsBySupplierId(supplierId).subscribe(data => {
      if (data && data.length > 0) {
        this.supplierItems = data;
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
}
