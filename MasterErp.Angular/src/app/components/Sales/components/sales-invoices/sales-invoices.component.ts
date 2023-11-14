import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../services/sales.service';
import { ToastrService } from 'ngx-toastr';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';

@Component({
  selector: 'app-sales-invoices',
  templateUrl: './sales-invoices.component.html',
  styleUrls: ['./sales-invoices.component.css']
})


export class SalesInvoicesComponent implements OnInit {
  SalesList: any[] = [];
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

  constructor(private salesService: SalesService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.GetSalesInvoicesData();
  }

  GetSalesInvoicesData() {
    this.showLoader=true;
    this.salesService.GetSalesInvoicesData(this.FilterModel).subscribe((data:any)=> {
      this.SalesList = data;
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
    this.GetSalesInvoicesData();
  }

  getStatusColor(status: boolean) {
    if (status == true)
      return "locked";
    else
      return "open";
  }

}
