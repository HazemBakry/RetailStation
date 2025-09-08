import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SubscriberApplicationModel } from '../../../models/Subscriber';
import { SubscriptionsService } from '../../../services/subscriptions.service';


@Component({
  selector: 'app-subscriber-applications',
  templateUrl: './subscriber-applications.component.html',
  styleUrls: ['./subscriber-applications.component.css']
})
export class SubscriberApplicationsComponent implements OnInit {

  subscriberId: string;
  subscriberApplications: SubscriberApplicationModel[] = [];
  showAddLoader: boolean = false;
  showLoader: boolean = false;
  pageResponseModel: PagedResponseModel<SubscriberApplicationModel[]> = {
    currentPage: 1,
    pageSize: 25,
    searchText: '',
    results: []
  }
  constructor(private subscriptionsService: SubscriptionsService, private acRoute: ActivatedRoute, private toaster: ToastrService, private datePipe: DatePipe) {

  }

  ngOnInit(): void {
    this.acRoute.parent.params.subscribe((params: any) => {
      if (params.SubscriberId) {
        this.subscriberId = params.SubscriberId;
        this.getSubscriberApplications();
      }
    });
  }

  getSubscriberApplications() {
    this.showLoader = true;
    this.subscriptionsService.getSubscriberApplications(this.subscriberId).subscribe((data: SubscriberApplicationModel[]) => {
      this.subscriberApplications = data;

      this.showLoader = true;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  saveSubscriberApplications() {

    this.showAddLoader = true;
    this.subscriptionsService.editSubscriberApplications(this.subscriberId, this.subscriberApplications).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.getSubscriberApplications();
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
  getFormattedDate(date: any) {
    if (date)
      return this.datePipe.transform(date, 'yyyy-MM-dd');
    return date;
  }
  startDateChanged(event, app: SubscriberApplicationModel) {
    var value = event.target.value;
    app.startDate = value;
  }
  endDateChanged(event, app: SubscriberApplicationModel) {
    var value = event.target.value;
    app.endDate = value;
  }
}
