import { Component, OnInit } from '@angular/core';
import { FilterItem, FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { GeneralAccountService } from '../../services/general-account.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { JournalEntryModel } from '../../models/GeneralAccounts/JurnalEntryModel';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';

@Component({
  selector: 'app-journal-daily-list',
  templateUrl: './journal-daily-list.component.html',
  styleUrls: ['./journal-daily-list.component.css']
})
export class JournalDailyListComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'سجل القيود اليومية'];
  filterList: FilterModel[] = [];
  showLoader: boolean = false;
  selectAll: boolean = false;
  pagedResponseModel: PagedResponseDTO<JournalEntryModel[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: ''

  };
  constructor(private generalService: GeneralAccountService,
    private router: Router,
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

  getSelectedEntries(): number[] {
    var checkedItems = this.pagedResponseModel.results.filter(b => b.isChecked && b.journalEntryId).map(i => Number(i.journalEntryId));
    if (checkedItems.length <= 0) {
      this.toaster.warning('يجب الاختيار من القيود ');

    }
    return checkedItems;
  }
  cancelJournalEntry() {

    let journalEntryIds = this.getSelectedEntries();
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
    let journalEntryIds = this.getSelectedEntries();
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

  reverseJournalEntry() {
    let journalEntryIds = this.getSelectedEntries();
    if (!journalEntryIds?.length)
      return;

    this.showLoader = true;
    this.generalService.ReverseJournalEntry(journalEntryIds).subscribe(data => {
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

  // onEditClick(journalEntryId: any) {
  //   this.router.navigate(['/general-accounts/new-entry'], { queryParams: { EntryId: journalEntryId } });
  // }

}
