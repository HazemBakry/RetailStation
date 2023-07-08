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
  filterModel: FilterModel = {
    filterItems: []
  };
  SelectAll = false;
  showLoader: boolean;
  totalCount: any;
  totalPages: any;
  pageSize: any = 20;
  currentPage: any = 1;

  constructor(private generalService: GeneralAccountService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.GetDailyJournalEntriesSummary();
    this.GetDailyJournalEntriesFilters();
  }

  GetDailyJournalEntriesSummary() {
    this.generalService.GetDailyJournalEntriesSummary(this.filterModel).subscribe(data => {
      this.DailyJournal = data;
      this.totalCount = this.DailyJournal.length;
      this.DailyJournal.map(i => i.isChecked == false);
    });
  }

  GetDailyJournalEntriesFilters() {
    this.generalService.GetDailyJournalEntriesFilters(this.filterModel).subscribe(data => {
      this.filterList = data;
    });
  }

  pageChanged(obj) {

  }

  filterChecked(filterItems: FilterItem[]) {
    this.filterModel.filterItems = filterItems;
    this.GetDailyJournalEntriesSummary();
  }

  SelectedAll(isSelected: boolean) {
    this.DailyJournal.forEach(i => i.isChecked = isSelected);
  }

  DropDailyJournalEntries() {
    let journalEntryIds = this.DailyJournal.map(i => i.journalEntryID);
    if (journalEntryIds.length == 0) {
      this.toaster.warning('Please Select Jurnal');
      return;
    }

    this.generalService.DropDailyJournalEntries(journalEntryIds).subscribe(data => {
      if (data) {
        this.SelectAll = false;
        this.DailyJournal.forEach(i => i.isChecked = false);
        this.toaster.success('Drop Journal Successfully');
      }
      else
        this.toaster.error('Drop Journal Failure');
    });
  }

  ExpulsionDailyJournalEntries() {
    let journalEntryIds = this.DailyJournal.map(i => i.journalEntryID);
    if (journalEntryIds.length == 0) {
      this.toaster.warning('Please Select Jurnal');
      return;
    }

    this.generalService.ExpulsionDailyJournalEntries(journalEntryIds).subscribe(data => {
      if (data) {
        this.SelectAll = false;
        this.DailyJournal.forEach(i => i.isChecked = false);
        this.toaster.success('Expulsion Journal Successfully');
      }
      else
        this.toaster.error('Expulsion Journal Failure');
    });
  }

  ReverseDailyJournalEntries() {
    let journalEntryIds = this.DailyJournal.map(i => i.journalEntryID);
    if (journalEntryIds.length == 0) {
      this.toaster.warning('Please Select Jurnal');
      return;
    }

    this.generalService.ReverseDailyJournalEntries(journalEntryIds).subscribe(data => {
      if (data) {
        this.SelectAll = false;
        this.DailyJournal.forEach(i => i.isChecked = false);
        this.toaster.success('Reverse Journal Successfully');
      }
      else
        this.toaster.error('Reverse Journal Failure');
    });
  }

  PrintDailyJournalEntries() {
    let journalEntryIds = this.DailyJournal.map(i => i.journalEntryID);
    if (journalEntryIds.length == 0) {
      this.toaster.warning('Please Select Jurnal');
      return;
    }

    this.generalService.PrintDailyJournalEntries(journalEntryIds).subscribe(data => {
      if (data) {
        this.SelectAll = false;
        this.DailyJournal.forEach(i => i.isChecked = false);
        this.toaster.success('Print Journal Successfully');
      }
      else
        this.toaster.error('Print Journal Failure');
    });
  }

}
