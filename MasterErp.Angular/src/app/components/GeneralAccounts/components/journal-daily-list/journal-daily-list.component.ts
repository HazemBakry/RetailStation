import { Component, OnInit } from '@angular/core';
import { FilterItem, FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { GeneralAccountService } from '../../services/general-account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-journal-daily-list',
  templateUrl: './journal-daily-list.component.html',
  styleUrls: ['./journal-daily-list.component.css']
})
export class JournalDailyListComponent implements OnInit {
  filterList: FilterModel[] = [];
  DailyJournal: any[] = [];
  SelectAll = false;
  showLoader: boolean;
  totalCount: any;
  totalPages: any;
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25,
    filterItems: []
  }

  constructor(private generalService: GeneralAccountService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.GetDailyJournalEntriesSummary();
    this.GetDailyJournalEntriesFilters();
  }

  GetDailyJournalEntriesSummary() {
    this.generalService.GetDailyJournalEntriesSummary(this.FilterModel).subscribe(data => {
      this.DailyJournal = data;
      this.totalCount = data && data.length > 0 && (data[0].matchCount != null || data[0].matchCount != undefined) ? data[0].matchCount : 0;
      this.DailyJournal.map(i => i.isChecked == false);
    });
  }

  GetDailyJournalEntriesFilters() {
    this.generalService.GetDailyJournalEntriesFilters(this.FilterModel).subscribe(data => {
      this.filterList = data;
    });
  }

  pageChanged(obj: any) {
    this.FilterModel.currentPage = obj.page;
    this.GetDailyJournalEntriesSummary();
  }

  filterChecked(filterItems: FilterItem[]) {
    this.FilterModel.filterItems = filterItems;
    this.GetDailyJournalEntriesSummary();
  }

  SelectedAll(isSelected: boolean) {
    this.DailyJournal.forEach(i => i.isChecked = isSelected);
  }

  CancelJournalEntry() {
    //let journalEntryIds = this.DailyJournal.map(i => i.journalEntryId);
    let journalEntryIds = this.DailyJournal.filter(a => a.isChecked).map(i => Number(i.journalEntryId));

    if (journalEntryIds.length == 0) {
      this.toaster.warning('Please Select Jurnal');
      return;
    }
    this.showLoader = true;
    this.generalService.CancelJournalEntry(journalEntryIds).subscribe(data => {
      if (data) {
        this.SelectAll = false;
        this.DailyJournal.forEach(i => i.isChecked = false);
        this.GetDailyJournalEntriesSummary();
        this.toaster.success('تم اسقاط القيود بنجاح');
      }
      else
        this.toaster.error('Drop Journal Failure');
      this.showLoader = false;
    });
  }

  PostJournalEntry() {
    let journalEntryIds = this.DailyJournal.filter(a => a.isChecked).map(i => Number(i.journalEntryId));
    //let journalEntryIds = this.DailyJournal.map(i => i.journalEntryId);
    if (journalEntryIds.length == 0) {
      this.toaster.warning('Please Select Jurnal');
      return;
    }
    this.showLoader = true;
    this.generalService.PostJournalEntry(journalEntryIds).subscribe(data => {
      if (data) {
        this.SelectAll = false;
        this.DailyJournal.forEach(i => i.isChecked = false);
        this.GetDailyJournalEntriesSummary();
        this.toaster.success('تم ترحيل القيوم بنجاح');
      }
      else
        this.toaster.error('Expulsion Journal Failure');
      this.showLoader = false;
    });
  }

  ReverseJournalEntry() {
    //let journalEntryIds = this.DailyJournal.map(i => i.journalEntryId);
    let journalEntryIds = this.DailyJournal.filter(a => a.isChecked).map(i => Number(i.journalEntryId));

    if (journalEntryIds.length == 0) {
      this.toaster.warning('Please Select Jurnal');
      return;
    }
    this.showLoader = true;
    this.generalService.ReverseJournalEntry(journalEntryIds).subscribe(data => {
      if (data) {
        this.SelectAll = false;
        this.DailyJournal.forEach(i => i.isChecked = false);
        this.GetDailyJournalEntriesSummary();
        this.toaster.success('تم عكس القيود بنجاح');
      }
      else
        this.toaster.error('Reverse Journal Failure');
      this.showLoader = false;
    });
  }

  PrintJournalEntry() {
    //let journalEntryIds = this.DailyJournal.map(i => i.journalEntryId);
    let journalEntryIds = this.DailyJournal.filter(a => a.isChecked).map(i => Number(i.journalEntryId));

    if (journalEntryIds.length == 0) {
      this.toaster.warning('Please Select Jurnal');
      return;
    }
    this.showLoader = true;
    this.generalService.PrintJournalEntry(journalEntryIds).subscribe(data => {
      if (data) {
        this.SelectAll = false;
        this.DailyJournal.forEach(i => i.isChecked = false);
        //this.GetDailyJournalEntriesSummary();
        //this.toaster.success('Print Journal Successfully');
      }
      else
        this.toaster.error('Print Journal Failure');
      this.showLoader = false;
    });
  }

}
