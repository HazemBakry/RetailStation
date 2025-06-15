import { Component, OnInit } from '@angular/core';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ToastrService } from 'ngx-toastr';
import { OrderModel } from '../../models/inventory';
import { InventoryService } from '../../services/inventory.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';

@Component({
  selector: 'app-material-issue-receipts',
  templateUrl: './material-issue-receipts.component.html',
  styleUrls: ['./material-issue-receipts.component.css']
})

export class MaterialIssueReceiptsComponent implements OnInit {
  TitleList = ['المخازن', 'إذن صرف مواد لفرع'];
  showLoader: boolean;
  materialIssueId: number;
  // FilterModel: FilterModel = {
  //   currentPage: 1,
  //   pageSize: 10
  // };

  pagedResponseModel: PagedResponseDTO<OrderModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''
  };

  constructor(private inventoryService: InventoryService,
    private modalService: NgbModal,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getMaterialIssueSummary();
  }

  getMaterialIssueSummary() {
    this.showLoader = true;
    this.inventoryService.GetMaterialIssue_Data(this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;
      //this.TotalCount = data && data.length > 0 && (data[0].matchCount != null || data[0].matchCount != undefined) ? data[0].matchCount : 0;

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getMaterialIssueSummary();
  }



  openDeleteModal(content: any, materialIssueId: number) {
    this.materialIssueId = materialIssueId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  cancelMaterialIssueOrder(materialIssueId: number) {
    this.inventoryService.CancelMaterialIssue(materialIssueId).subscribe(data => {
      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getMaterialIssueSummary();
        this.toaster.success(data?.message);
      }
      else {
        this.toaster.error(data?.message);
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  getStatusColor(status: boolean) {
    if (status == true)
      return "cancelled";
    else
      return "open";
  }

}
