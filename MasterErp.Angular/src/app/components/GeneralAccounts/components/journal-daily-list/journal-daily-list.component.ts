import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FilterItem, FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { GeneralAccountService } from '../../services/general-account.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { JournalEntryModel } from '../../models/GeneralAccounts/JurnalEntryModel';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/components/Shared/services/shared.service';

@Component({
  selector: 'app-journal-daily-list',
  templateUrl: './journal-daily-list.component.html',
  styleUrls: ['./journal-daily-list.component.css']
})
export class JournalDailyListComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'سجل القيود اليومية'];
  filterList: FilterModel[] = [];
  showLoader: boolean = false;
  showExportLoader: boolean = false;
  selectAll: boolean = false;
  pagedResponseModel: PagedResponseDTO<JournalEntryModel[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: ''

  };
   @ViewChild('DetailsSidePanel', { static: true }) DetailsSidePanel: TemplateRef<any>;
   selectedEntryModel: JournalEntryModel = {} as JournalEntryModel;

  constructor(private generalService: GeneralAccountService,
    private router: Router,
    private offcanvasService: NgbOffcanvas, 
    private sharedService:SharedService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getDailyJournalEntriesSummary();
    this.getDailyJournalEntriesFilters();
  }

  getDailyJournalEntriesSummary() {
    this.showLoader=true;
    this.generalService.GetDailyJournalEntriesSummary(this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data?.results;
      this.pagedResponseModel.totalCount = data?.totalCount;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  
  exportData() {
    this.showExportLoader = true;
    this.generalService.ExportDailyJournalEntries(this.pagedResponseModel).subscribe((data: ActionsResponseModel) => {
      if (data.isSuccess) {
        this.sharedService.urlDownloadOrOpen(data.url);
        this.toaster.success(data.message);
      } else {
        this.toaster.error(data.message);
      }


      this.showExportLoader = false;
    }, err => {
      this.showExportLoader = false;
    }, () => {
      this.showExportLoader = false;
    });


  }

  getDailyJournalEntriesFilters() {
    this.generalService.GetDailyJournalEntriesFilters(this.pagedResponseModel).subscribe((data: FilterModel[]) => {
      this.filterList = data;
    }, (err) => {
      // this.showLoader = false;
    }, () => {
      // this.showLoader = false;
    });
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getDailyJournalEntriesSummary();
  }

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.getDailyJournalEntriesSummary();
  }


  selectAllData() {
    if (this.pagedResponseModel.results && this.pagedResponseModel.results.length > 0) {
      this.pagedResponseModel.results.map(c => {
        c.isChecked = this.selectAll;
      });
    }

  }

  // getSelectedEntries(): number[] {
  //   var checkedItems = this.pagedResponseModel.results.filter(b => b.isChecked && b.journalEntryId).map(i => Number(i.journalEntryId));
  //   if (checkedItems.length <= 0) {
  //     this.toaster.warning('يجب الاختيار من القيود ');

  //   }
  //   return checkedItems;
  // }
  getSelectedEntries(action: '' | 'post' | 'cancel' | 'cancelPost' = ''): number[] {
    const selectedItems = this.pagedResponseModel.results.filter(b => b.isChecked && b.journalEntryId);

    const validItems = selectedItems.filter(b => {
      switch (action) {
        case 'post':
          return !b.isPosted;
        case 'cancel':
          return !b.isCancelled && !b.isPosted;
        case 'cancelPost':
          return b.isPosted;
        default:
          return true;
      }
    });

    const notValidItems = selectedItems.filter(b => !validItems.includes(b));
    if (notValidItems.length > 0) {
      const actionType = action === 'post' ? 'غير مرحله' : action === 'cancel' ? ' غير ملغية وغير مرحلة' : action === 'cancelPost' ? ' مرحل' : '';
      this.toaster.warning(`يجب اختيار قيود ${actionType} فقط`);
    }
    if (validItems.length === 0 && notValidItems.length === 0) {
      this.toaster.warning('يجب الاختيار من القيود المناسبة للإجراء المطلوب');
    }

    return validItems.map(i => Number(i.journalEntryId));
  }

  cancelJournalEntry() {

    let journalEntryIds = this.getSelectedEntries('cancel');
    if (!journalEntryIds?.length)
      return;

    this.showLoader = true;
    this.generalService.CancelJournalEntry(journalEntryIds).subscribe((data: ActionsResponseModel) => {
      if (data.isSuccess) {
        this.selectAll = false;
        this.getDailyJournalEntriesSummary();
        this.toaster.success(data.message);
      }
      else {
        this.toaster.error(data.message);
      }
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  postJournalEntry() {
    let journalEntryIds = this.getSelectedEntries('post');
    if (!journalEntryIds?.length)
      return;

    this.showLoader = true;
    this.generalService.PostJournalEntry(journalEntryIds).subscribe(data => {
      if (data.isSuccess) {
        this.selectAll = false;
        this.getDailyJournalEntriesSummary();
        this.toaster.success(data.message);
      }
      else {
        this.toaster.error(data.message);
      }
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  cancelPostJournalEntry() {
    let journalEntryIds = this.getSelectedEntries('cancelPost');
    if (!journalEntryIds?.length)
      return;

    this.showLoader = true;
    this.generalService.CancelPostJournalEntry(journalEntryIds).subscribe(data => {
      if (data.isSuccess) {
        this.selectAll = false;
        this.getDailyJournalEntriesSummary();
        this.toaster.success(data.message);
      }
      else {
        this.toaster.error(data.message);
      }
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  printJournalEntry() {
    let journalEntryIds = this.getSelectedEntries();
    if (!journalEntryIds?.length)
      return;


    this.showLoader = true;
    this.generalService.PrintJournalEntry(journalEntryIds).subscribe(data => {
      if (data.isSuccess) {
        this.selectAll = false;
        this.getDailyJournalEntriesSummary();
        this.toaster.success(data.message);
      }
      else {
        this.toaster.error(data.message);
      }
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }


  openSidePanel(journalEntryId:number,content: any = null) {
    this.getEntryDetailsById(journalEntryId);
    if (content == null)
      this.offcanvasService.open(this.DetailsSidePanel, { panelClass: 'details-panel', position: 'end' });
    else
      this.offcanvasService.open(content, { panelClass: 'details-panel', position: 'end' });
  }

  getEntryDetailsById(journalEntryId:number) {
    this.showLoader = true;
    this.generalService.GetJournalEntryDetailsById(journalEntryId).subscribe(data => {
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
  // onEditClick(journalEntryId: any) {
  //   this.router.navigate(['/general-accounts/new-entry'], { queryParams: { EntryId: journalEntryId } });
  // }

}
