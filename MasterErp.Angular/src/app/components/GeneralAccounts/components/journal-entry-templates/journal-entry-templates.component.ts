import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FilterItem, FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { GeneralAccountService } from '../../services/general-account.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { JournalTemplateModel } from '../../models/GeneralAccounts/JournalTemplateDetailsModel';

@Component({
  selector: 'app-journal-entry-templates',
  templateUrl: './journal-entry-templates.component.html',
  styleUrls: ['./journal-entry-templates.component.css']
})
export class JournalEntryTemplatesComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'قوالب القيود اليومية'];
  filterList: FilterModel[] = [];
  showLoader: boolean = false;
  showExportLoader: boolean = false;
  selectAll: boolean = false;
  pagedResponseModel: PagedResponseDTO<JournalTemplateModel[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: ''

  };
   @ViewChild('DetailsSidePanel', { static: true }) DetailsSidePanel: TemplateRef<any>;
   selectedEntryTemplateModel: JournalTemplateModel = {} as JournalTemplateModel;

  constructor(private generalService: GeneralAccountService,
    private router: Router,
    private offcanvasService: NgbOffcanvas, 
    private sharedService:SharedService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getSavedJournalTemplates();
  }
  getSavedJournalTemplates() {

    this.showLoader=true;
    this.generalService.GetSavedJournalTemplates(this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data?.results;
      this.pagedResponseModel.totalCount = data?.totalCount;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  
  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getSavedJournalTemplates();
  }

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.getSavedJournalTemplates();
  }



  openSidePanel(journalTemplateId:number,content: any = null) {
    this.getJournalTemplateDetailsById(journalTemplateId);
    if (content == null)
      this.offcanvasService.open(this.DetailsSidePanel, { panelClass: 'details-panel', position: 'end' });
    else
      this.offcanvasService.open(content, { panelClass: 'details-panel', position: 'end' });
  }


  getJournalTemplateDetailsById(journalTemplateId) {
    this.showLoader = true;
    this.generalService.GetJournalTemplateDetailsById(journalTemplateId).subscribe(data => {
      if (data) {
        this.selectedEntryTemplateModel = data;
      }
      this.showLoader = false;
    }, (error) => {
      this.showLoader = false;

    }, () => {
      this.showLoader = false;
    });
  }

}
