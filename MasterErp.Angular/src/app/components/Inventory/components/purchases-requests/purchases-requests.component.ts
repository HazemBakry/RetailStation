import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ToastrService } from 'ngx-toastr';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';

@Component({
  selector: 'app-purchases-requests',
  templateUrl: './purchases-requests.component.html',
  styleUrls: ['./purchases-requests.component.css']
})

export class PurchasesRequestsComponent implements OnInit {
  showLoader: boolean;
  TotalCount: any;
  TotalPages: any;
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25
  };
  pagedResponse:PagedResponseDTO<any[]>={
    currentPage:1,
    pageSize:25,
    results:[],
    filterList:[]
  }

  constructor(private InventoryService: InventoryService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader=true;
    this.InventoryService.GetPurchasesRequestsData(this.FilterModel).subscribe((data:any)=> {
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
