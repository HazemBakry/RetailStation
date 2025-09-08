import { Component, OnInit, ViewChild } from '@angular/core';

import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SubscriberModel } from '../../../models/Subscriber';
import { SubscriptionsService } from '../../../services/subscriptions.service';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { WorkflowStatus } from 'src/app/components/Shared/Enums/FinanceWorkflowStatus';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SubscriberType } from 'src/app/components/Shared/Enums/SubscriptionTypeEnum';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.css']
})
export class SubscribersComponent implements OnInit {
  TitleList = ['وحدة التحكم', 'المشتركين'];
  public wfStatus = WorkflowStatus;
  public SubscriberType = SubscriberType;
  filterList: FilterItem[] = [];

  mainFilter: FilterItem = { categoryName: 'DueStatus', itemFlag: '4' }
  showAddLoader: boolean = false;
  selectedSubscriberId: string;
  pagedResponseModel: PagedResponseModel<SubscriberModel[]> = {
    currentPage: 1,
    pageSize: 25,
    searchText: '',
    results: []
  }
  showLoader: boolean = false;
  constructor(private subscriptionsService: SubscriptionsService, private offcanvasService: NgbOffcanvas, private modalService: NgbModal,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.GetAllSubscribers();
  }

  GetAllSubscribers() {
    this.showLoader = true;

    this.subscriptionsService.getAllSubscribersData(this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;


      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }


  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.GetAllSubscribers();
  }

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.pagedResponseModel.filterList.push(this.mainFilter);
    this.GetAllSubscribers();
  }


  openDeleteModal(content: any, selectedSubscriberId: string) {
    this.selectedSubscriberId = selectedSubscriberId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  deleteSubscriber() {
    this.showAddLoader = true;
    this.subscriptionsService.deleteSubscriber(this.selectedSubscriberId).subscribe(data => {

      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.GetAllSubscribers();
        this.toaster.success(data?.message);
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

}

