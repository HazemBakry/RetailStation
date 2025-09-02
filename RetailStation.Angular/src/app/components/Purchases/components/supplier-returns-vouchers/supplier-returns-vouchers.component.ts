import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { PurchaseService } from '../../services/purchase.service';

@Component({
  selector: 'app-supplier-returns-vouchers',
  templateUrl: './supplier-returns-vouchers.component.html',
  styleUrls: ['./supplier-returns-vouchers.component.css']
})

export class SupplierReturnsVouchersComponent implements OnInit {
  showLoader: boolean;
  TotalCount: any;
  TotalPages: any;
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 10
  };
  pagedResponse:PagedResponseDTO<any[]>={
    currentPage:1,
    pageSize:25,
    results:[],
    filterList:[]
  }

  constructor(private purchaseService: PurchaseService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader=true;
    this.purchaseService.GetSupplierReturnsVoucherData(this.FilterModel).subscribe((data:any)=> {
      this.pagedResponse.results=data.results;
      this.pagedResponse.totalCount=data.totalCount;
      this.pagedResponse.currentPage=data.currentPage;
      this.pagedResponse.pageSize=data.pageSize;
      this.pagedResponse.totalPages=data.totalPages;
      // this.TotalCount = data && data.length > 0 && (data[0].matchCount != null || data[0].matchCount != undefined) ? data[0].matchCount : 0;
      this.showLoader=false;
    },(err)=>{
      this.showLoader=false;
    },()=>{
      this.showLoader=false;
    })
  }

  pageChanged(obj: any) {
    this.FilterModel.currentPage = obj.page;
    this.loadData();
  }

  getStatusColor(status: boolean) {
    if (status == true)
      return "locked";
    else
      return "open";
  }

}