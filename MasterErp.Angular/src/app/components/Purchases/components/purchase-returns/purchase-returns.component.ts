import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { OrderModel } from 'src/app/components/Inventory/models/inventory';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseReturnsModel } from '../../models/PurchaseReturns';
@Component({
  selector: 'app-purchase-returns',
  templateUrl: './purchase-returns.component.html',
  styleUrls: ['./purchase-returns.component.css']
})
export class PurchaseReturnsComponent implements OnInit {
    TitleList = ['المشتريات', 'مرتجعات المشتريات'];

  showLoader: boolean;
  pagedResponseModel: PagedResponseDTO<PurchaseReturnsModel[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: ''

  };
  selectedPurchaseReturnsId: number;
  constructor(private purchaseService: PurchaseService,
    private modalService: NgbModal, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader = true;

    this.purchaseService.GetPurchaseReturns_Data(this.pagedResponseModel).subscribe(data => {
      // this.PurchaseList = data.results;
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;
      this.showLoader = false;

    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.loadData();
  }
  openDeleteModal(content: any, itemId: number) {
    this.selectedPurchaseReturnsId = itemId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }
  cancelPurchaseReturns() {
    this.purchaseService.CancelPurchaseReturns(this.selectedPurchaseReturnsId).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success('تم الغاء الطلب بنجاح');
        this.loadData();
      }
      else {
        this.toaster.error('حدث خطأ اثناء الألغاء');
      }
    }, (error) => {
      this.toaster.error('حدث خطأ اثناء الألغاء');
    })
  }

}
