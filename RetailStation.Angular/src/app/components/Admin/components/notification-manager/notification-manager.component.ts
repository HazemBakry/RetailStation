import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, Subject, switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { AdminService } from '../../services/Admin.service';

@Component({
  selector: 'app-notification-manager',
  templateUrl: './notification-manager.component.html',
  styleUrls: ['./notification-manager.component.css'],
})
export class NotificationManagerComponent implements OnInit {
  TitleList = ['إدارة النظام', 'إدارة الإشعارات'];

  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 20,
    filterItems: [],
  };
  showLoader: boolean;
  NotificationData: any[] = [];
  totalCount: any;
  totalPages: any;
  pageSize: any = 20;
  currentPage: any = 1;
  notificationDetail: any;
  notificationRecipient: any[] = [];
  form: FormGroup;
  customers: any[] = [];
  @ViewChild('NotificationDetailsSidePanel')
  NotificationDetailsSidepanelEl: HTMLElement;
  loadingCustomers = false;
  customerSearch$ = new Subject<string>();
  subscriberIds: any[] = [];
  constructor(
    private adminService: AdminService,
    private modalService: NgbModal,
    private offcanvasService: NgbOffcanvas,
    private fb: FormBuilder,
    private toaster: ToastrService,
  ) { }

  ngOnInit() {
    this.FormInit();
    this.getNotifications();
    this.loadTopCustomers(); // initial top 20
    this.setupCustomerSearch(); // remote search
  }

  getNotifications() {
    this.showLoader = true;
    this.adminService.GetNotifications(this.FilterModel).subscribe((data) => {
      this.NotificationData = data;
      this.totalCount =
        data &&
          data.length > 0 &&
          (data[0].matchCount != null || data[0].matchCount != undefined)
          ? data[0].matchCount
          : 0;
      this.showLoader = false;
    });
  }

  pageChanged(obj: any) {
    this.FilterModel.currentPage = obj.page;
    this.getNotifications();
  }

  openSidepanel(notificationDetail: any, type: string = null) {
    this.notificationDetail = notificationDetail;

    if (this.notificationDetail && this.notificationDetail.id) {
      this.GetRecipientsByNotificationID(notificationDetail.id);
    }

    this.offcanvasService.open(this.NotificationDetailsSidepanelEl, {
      position: 'end',
    });
  }

  GetRecipientsByNotificationID(notificationID: number) {
    this.adminService
      .GetRecipientsByNotificationID(notificationID)
      .subscribe((data) => {
        this.notificationRecipient = data;
      });
  }

  open(content: any, branch: any) {
    this.FormInit();
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  openEdit(content: any, item: any) {
    this.adminService.GetRecipientsByNotificationID(item.id).subscribe(recipients => {
      const selectedCustomers = recipients.map(r => ({
        id: r.id,
        name: r.name
      }));
      // Set the few needed customers to ng-select
      this.customers = selectedCustomers;
      // Patch only the selected IDs
      this.form.patchValue({
        id: item.id,
        title: item.subject,
        content: item.content,
        subscriberIds: selectedCustomers.map(c => c.id)
      });
    });
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  FormInit() {
    this.form = this.fb.group({
      id: [0, Validators.required],
      title: ['', Validators.required],
      content: ['', Validators.required],
      subscriberIds: [[]], // This holds selected customer IDs
    });
  }

  loadTopCustomers() {
    this.loadingCustomers = true;
    this.adminService.getCustomers({ take: 20 }).subscribe(data => {
      this.customers = data;
      this.loadingCustomers = false;
    });


  }

  setupCustomerSearch() {
    this.customerSearch$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        this.loadingCustomers = true;
        return this.adminService.getCustomers({ search: term, take: 20 }).pipe(
          finalize(() => this.loadingCustomers = false)
        );
      })
    ).subscribe(data => {
      this.customers = data;
    });
  }

  SaveNotification() {
    const formData = new FormData();
    let FormValue = this.form.value;

    formData.append('title', FormValue.title);
    formData.append('content', FormValue.content);
    formData.append('recipientsIds', FormValue.subscriberIds);
    if (FormValue) {
      this.adminService.SaveNotification(this.form.value).subscribe((data) => {
        if (data.item1 == 200) {
          this.toaster.success(data.item2);
          this.FormInit();
          this.getNotifications();
        } else this.toaster.error(data.item2);
      });
    }
  }

  UpdateNotification() {
    const formData = new FormData();
    let FormValue = this.form.value;
    formData.append('id', FormValue.id);
    formData.append('title', FormValue.title);
    formData.append('content', FormValue.content);
    formData.append('recipientsIds', FormValue.subscriberIds);
    if (FormValue) {
      this.adminService.UpdateNotification(this.form.value).subscribe((data) => {
        if (data.item1 == 200) {
          this.toaster.success(data.item2);
          this.FormInit();
          this.getNotifications();
        } else this.toaster.error(data.item2);
      });
    }
  }

  onToggleStatus(item: any): void {
    const originalValue = item.isActive;
    item.isActive = !item.isActive;

    this.adminService.updateIsActive(item.id, item.isActive).subscribe({
      next: () => {
        this.toaster.success('Status updated');
      },
      error: () => {
        this.toaster.error('Failed to update status');
        item.isActive = originalValue; // Revert on failure
      }
    });
  }
}
