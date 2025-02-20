import { Component, OnInit } from '@angular/core';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ToastrService } from 'ngx-toastr';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { GeneralAccountService } from '../../services/general-account.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { JournalEntryTypeModel, } from '../../models/JournalEntryTypeModel';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { PaymentService } from '../../services/payment.service';


@Component({
  selector: 'app-journal-entry-types',
  templateUrl: './journal-entry-types.component.html',
  styleUrls: ['./journal-entry-types.component.css']
})

export class JournalEntryTypesComponent implements OnInit {

  showLoader: boolean;

  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25
  };
  pagedResponse: PagedResponseDTO<any[]> = {
    currentPage: 1,
    pageSize: 25,
    results: [],
    filterList: []
  }
  journalEntryTypeModel: JournalEntryTypeModel =
    {} as JournalEntryTypeModel;

  constructor(private GeneralAccountsService: GeneralAccountService, private toaster: ToastrService,
    private sharedService: SharedService,
    private modalService: NgbModal,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader = true;
    this.GeneralAccountsService.GetJournalEntryTypesData(this.FilterModel).subscribe((data: any) => {
      this.pagedResponse.results = data.results;
      this.pagedResponse.totalCount = data.totalCount;
      this.pagedResponse.currentPage = data.currentPage;
      this.pagedResponse.pageSize = data.pageSize;
      this.pagedResponse.totalPages = data.totalPages;
      // this.TotalCount = data && data.length > 0 && (data[0].matchCount != null || data[0].matchCount != undefined) ? data[0].matchCount : 0;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }

  pageChanged(obj: any) {
    this.FilterModel.currentPage = obj.page;
    this.loadData();
  }

  CreateNewJournalEntryType() {
    if (!this.validateFields()) {
      return;
    }
    this.GeneralAccountsService
      .CreateNewJournalEntryType(this.journalEntryTypeModel)
      .subscribe((data: ActionsResponseModel) => {
        if (data?.status) {
          this.ClearAllFields();
          this.toaster.success(data?.message);
        } else {
          this.toaster.error(data?.message);
        }
        this.modalService.dismissAll();
        this.loadData();
      });
  }


  validateFields(): boolean {
    let model: JournalEntryTypeModel = this.journalEntryTypeModel;

    if (
      !model.code ||
      !model.nameEN ||
      !model.nameAR
    ) {
      this.toaster.warning('يرجي ملئ جميع الخانات');
      return false;
    }
    return true;
  }
  ClearAllFields() {
    this.journalEntryTypeModel = {} as JournalEntryTypeModel;

  }
  openModal(content: any) {

    this.ClearAllFields();
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  getStatusColor(status: boolean) {
    if (status == true)
      return "locked";
    else
      return "open";
  }

}
