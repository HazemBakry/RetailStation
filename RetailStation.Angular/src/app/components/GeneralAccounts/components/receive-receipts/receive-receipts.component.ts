import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { PaymentService } from '../../services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ReceiveReceipt } from '../../models/GeneralAccounts/ReceiveReceipt';
import { GeneralAccountService } from '../../services/general-account.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { JournalEntryModel } from '../../models/GeneralAccounts/JurnalEntryModel';

@Component({
  selector: 'app-receive-receipts',
  templateUrl: './receive-receipts.component.html',
  styleUrls: ['./receive-receipts.component.css']
})
export class ReceiveReceiptsComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'سندات القبض'];
  showLoader: boolean;
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 10
  };

  ReceiveReceipts: PagedResponseDTO<ReceiveReceipt[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''
  };
  selectedEntryModel: JournalEntryModel = {} as JournalEntryModel;
  @ViewChild('DetailsSidePanel', { static: true }) DetailsSidePanel: TemplateRef<any>;


  constructor(private paymentService: PaymentService,
    private generalService: GeneralAccountService,
    private offcanvasService: NgbOffcanvas,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getReceiveReceiptsSummary();
  }

  getReceiveReceiptsSummary() {
    this.showLoader = true;
    this.paymentService.GetReceiveReceipts_Summary(this.FilterModel).subscribe(data => {
      this.ReceiveReceipts.results = data.results;
      this.ReceiveReceipts.totalCount = data.totalCount;
      //this.TotalCount = data && data.length > 0 && (data[0].matchCount != null || data[0].matchCount != undefined) ? data[0].matchCount : 0;

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  pageChanged(obj: any) {
    this.FilterModel.currentPage = obj.page;
    this.getReceiveReceiptsSummary();
  }

  openSidePanel(entryId: number, content: any = null) {
    //this.EntryId = journalEntryId;
    this.getEntryDetailsByEntryId(entryId);
    if (content == null)
      this.offcanvasService.open(this.DetailsSidePanel, { panelClass: 'details-panel', position: 'end' });
    else
      this.offcanvasService.open(content, { panelClass: 'details-panel', position: 'end' });
  }

  getEntryDetailsByEntryId(entryId: number) {
    this.showLoader = true;
    this.generalService.GetEntryDetailsByEntryId(entryId).subscribe(data => {
      if (data) {
        this.selectedEntryModel = data;
      }
      this.showLoader = false;
    }, (error) => {
      this.showLoader = false;

    }, () => {
      this.showLoader = false;
    });
  }


  cancelReceipt(receiptId: number) {
    this.paymentService.CancelReceiveReceipt(receiptId).subscribe(data => {
      if (data) {
        this.toaster.success('تم الغاء السند بنجاح');
        this.getReceiveReceiptsSummary();
      }
      else {
        this.toaster.error('حدث خطأ اثناء الإلغاء');
      }
    }, (error) => {
      this.toaster.error('حدث خطأ اثناء الإلغاء');
    })
  }

  getStatusColor(status: boolean) {
    if (status == true)
      return "locked";
    else
      return "open";
  }

}