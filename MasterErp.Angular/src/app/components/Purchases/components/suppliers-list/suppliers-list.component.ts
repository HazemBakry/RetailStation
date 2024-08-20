import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { ToastrService } from 'ngx-toastr';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { ItemModel } from 'src/app/components/Inventory/models/Item';
import { InventoryService } from 'src/app/components/Inventory/services/inventory.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrls: ['./suppliers-list.component.css']
})
export class SuppliersListComponent implements OnInit {
  SupplierList: any[] = [];
  showLoader: boolean;
  TotalCount: any;
  TotalPages: any;
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25
  };

 constructor(private purchaseService: PurchaseService,private inventoryService:InventoryService,private modalService :NgbModal, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.GetSuppliersData();
  }


  GetSuppliersData() {
    this.showLoader=true;
    this.purchaseService.GetSuppliersData().subscribe(data => {
      this.SupplierList = data;
      this.TotalCount = data && data.length > 0 && (data[0].matchCount != null || data[0].matchCount != undefined) ? data[0].matchCount : 0;
      this.showLoader=false;
    },(err)=>{
      this.showLoader=false;
    },()=>{
      this.showLoader=false;
    })
  }

  pageChanged(obj: any) {
    this.FilterModel.currentPage = obj.page;
    this.GetSuppliersData();
  }
  supplierItems:ItemModel[]=[];
  openItemsDialog(content: any,itemId:number) {
    this.supplierItems=[];
    this.inventoryService.GetItemsBySupplierId(itemId).subscribe(data => {

      if(data&&data.length>0) {
        this.supplierItems=data;
      }
      this.showLoader=false;
    }, err=>{
      this.showLoader=false;
    },()=>{
      this.showLoader=false;
    });
    this.modalService.open(content, { centered: true, size: 'lg' });

    // this.offcanvasService.open(content, { panelClass: 'add-new-panel', position: 'end' });
  }

}
