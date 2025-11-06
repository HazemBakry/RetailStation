import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { AdminService } from '../../services/Admin.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { BestSellerItemsModel } from 'src/app/components/Shared/models/BestSellerItemsModel';
import { MerchantManagementService } from 'src/app/components/Website/services/merchant-management.service';
import { MerchantItemModel } from 'src/app/components/Shared/models/MerchantItemModel';

@Component({
  selector: 'app-best-seller-items',
  templateUrl: './best-seller-items.component.html',
  styleUrls: ['./best-seller-items.component.css']
})
export class BestSellerItemsComponent implements OnInit {
  TitleList = ['Best Sellers Items'];
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  showMerchantLoader: boolean = false;
  merchantItemsResponseModel: PagedResponseModel<MerchantItemModel[]> = {
    currentPage: 1,
    pageSize: 10,
    results: [],
    filterList: [],
    searchText: ''
  }
  merchantsSelectorData: GeneralSelectorModel[] = [];
  bestSellerItems: BestSellerItemsModel[] = [];
  merchantItems: BestSellerItemsModel[] = [];
  selectedMerchantId: number;
  constructor(private adminService: AdminService,
    private toaster: ToastrService,
    private modalService: NgbModal,
    private merchantManagementService: MerchantManagementService,
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.loadSelectors();
  }
  loadSelectors() {
    this.sharedService.GetMerchantsSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.merchantsSelectorData = data;
    });
  }
  loadData() {
    this.showLoader = true;
    this.adminService.GetBestSellerItems_Data().subscribe((data: BestSellerItemsModel[]) => {
      this.bestSellerItems = data;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }

  pageChanged(obj: any) {
    this.merchantItemsResponseModel.currentPage = obj.page;
    this.loadMerchantItems_Data(this.selectedMerchantId);
  }

  filterChecked(filterItems: FilterItem[]) {
    this.merchantItemsResponseModel.filterList = filterItems;
    this.loadMerchantItems_Data(this.selectedMerchantId);
  }

  onMerchantChange(merchantId: number) {
    this.selectedMerchantId = merchantId;
    this.merchantItemsResponseModel.results = [];
    this.merchantItemsResponseModel.totalCount = 0;
    this.merchantItems = [];
    this.loadMerchantItems_Data(merchantId);
  }

  loadMerchantItems_Data(merchantId) {
    this.showMerchantLoader = true;
    this.merchantManagementService.GetMerchantItems_Data(merchantId, this.merchantItemsResponseModel).subscribe(data => {
      this.merchantItemsResponseModel.results = data.results;
      this.merchantItemsResponseModel.totalCount = data.totalCount;

      this.updateMerchantAddedItems();
      this.showMerchantLoader = false;
    }, err => {
      this.showMerchantLoader = false;
    }, () => {
      this.showMerchantLoader = false;
    });
  }

  updateMerchantAddedItems() {
    this.merchantItems = this.merchantItemsResponseModel.results.map(mi => {
      const existingBestSeller = this.bestSellerItems.find(bsi => bsi.merchantItemId === mi.merchantItemId);
      return {
        bestSellerItemId: existingBestSeller ? existingBestSeller.bestSellerItemId : 0,
        merchantItemId: mi.merchantItemId,
        merchantItemName: mi.nameAR ?? mi.nameEN,
        merchantName: mi.merchantName,
        isActive: existingBestSeller ? existingBestSeller.isActive : false,
        displayOrder: existingBestSeller ? existingBestSeller.displayOrder : 0,
        isBestSellerAdded: existingBestSeller ? true : false
      } as BestSellerItemsModel;
    });
  }
  addToBestSellerList(item: BestSellerItemsModel) {
    const index = this.bestSellerItems.findIndex(bsi => bsi.merchantItemId === item.merchantItemId);
    if (index > -1) {
      this.bestSellerItems[index] = item;
    } else {
      this.bestSellerItems.push(item);
    }
    this.updateMerchantAddedItems();
  }
  removeFromBestSellerList(item: BestSellerItemsModel) {
    const index = this.bestSellerItems.findIndex(bsi => bsi.merchantItemId === item.merchantItemId);
    if (index > -1) {
      this.bestSellerItems.splice(index, 1);
    }
    this.updateMerchantAddedItems();
  }
  moveItemAndReindex(direction: number, item: BestSellerItemsModel) {
    const index = this.bestSellerItems.findIndex(bsi => bsi.merchantItemId === item.merchantItemId);

    if (index > -1) {
      const newIndex = index + direction;

      if (newIndex >= 0 && newIndex < this.bestSellerItems.length) {

        const [itemToMove] = this.bestSellerItems.splice(index, 1);
        this.bestSellerItems.splice(newIndex, 0, itemToMove);

        this.bestSellerItems.forEach((bsItem, idx) => {
          bsItem.displayOrder = idx + 1;
        });
      }
    }
  }

  openConfirmModal(content: any) {
    this.modalService.open(content, { centered: true, size: 'sm' });
  }
  updateBestSellerItems() {

    this.showAddLoader = true;
    this.adminService.UpdateBestSellerItems(this.bestSellerItems).subscribe(data => {
      if (data?.isSuccess) {
        this.loadData();
        this.toaster.success(data?.message);
        this.selectedMerchantId = null;
        this.merchantItemsResponseModel.results = [];
        this.merchantItemsResponseModel.totalCount = 0;
        this.merchantItems = [];
        this.modalService?.dismissAll();
      }
      else {
        this.toaster.error(data?.message);
      }
      this.showAddLoader = false;
    }, err => {
      this.showAddLoader = false;
    }, () => {
      this.showAddLoader = false;
    });



  }



  // deleteTopPartner() {
  //   this.showAddLoader = true;
  //   this.adminService.DeleteTopPartner(this.selectedTopPartnerId).subscribe(data => {
  //     if (data?.isSuccess) {
  //       this.modalService?.dismissAll();
  //       this.loadData();
  //       this.toaster.success(data?.message);
  //     }
  //     else {
  //       this.toaster.error(data?.message);
  //     }
  //     this.showAddLoader = false;
  //   }, err => {
  //     this.showAddLoader = false;
  //   }, () => {
  //     this.showAddLoader = false;
  //   });
  // }
  // changeStatus(id: number) {
  //   this.adminService.ChangeTopPartnerActiveStatus(id).subscribe(data => {
  //     if (data.isSuccess) {
  //       this.toaster.success(data.message);
  //       this.loadData();
  //     } else this.toaster.error(data.message);
  //   });
  // }

}

