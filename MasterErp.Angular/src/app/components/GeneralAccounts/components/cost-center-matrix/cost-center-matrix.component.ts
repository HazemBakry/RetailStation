import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FilterItem, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { GeneralAccountService } from '../../services/general-account.service';

@Component({
  selector: 'app-cost-center-matrix',
  templateUrl: './cost-center-matrix.component.html',
  styleUrls: ['./cost-center-matrix.component.css']
})

export class CostCenterMatrixComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'مصفوفه مراكز التكلفة'];
  SearchResult: any[] = [];
  TotalCount: any;
  TotalPages: any;
  costCenterTypeList:any[]=[];

  pageFilter:FilterItem[]=[];
  extendedFilter:FilterItem[]=[];

  SearchFilterModel: SearchFilterModel = {
    currentPage: 1,
    pageSize: 25,
    isExport: false,
    filterItems: [],
    filterModel: { filterItems: [] }
  };

  constructor(private generalService: GeneralAccountService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.costCenterTypeList=this.generalService.costCenterTypeList;
  }

  loadData() {
    if (!this.validateSearchModel()) {
      return;
    }
    this.SearchFilterModel.isExport = false;

    this.generalService.GetCostCenterMatrix(this.SearchFilterModel).subscribe(data => {
      this.SearchResult = data;
      this.TotalCount = data && data.length > 0 && (data[0].matchCount != null || data[0].matchCount != undefined) ? data[0].matchCount : 0;
    });
  }

  exportData() {
    if (!this.validateSearchModel()) {
      return;
    }
    this.SearchFilterModel.isExport = true;

    this.generalService.ExportCostCenterMatrix(this.SearchFilterModel).subscribe(data => {
      if (data.url != null) {
        window.location.href = data.url;
        this.toaster.success("File exported successfully");
      } else {
        this.toaster.error("an Error happened , file can not export");
      }
    });
  }

  printData()
  {

  }

  applyFilterChanges()
  {

    this.SearchFilterModel.filterItems=[];
    this.SearchFilterModel.filterItems=this.pageFilter.concat(this.extendedFilter);
    
  }

  headerSearchChanged(filter:SearchFilterModel)
  {
    this.SearchFilterModel.fromDate=filter.fromDate;
    this.SearchFilterModel.toDate=filter.toDate;
    
    this.extendedFilter=[];

    this.extendedFilter=[...new Set(filter.filterItems.map(item => item))]
    this.applyFilterChanges();

  
  }
  pageChanged(obj: any) {
    this.SearchFilterModel.currentPage = obj.page;
    this.loadData();
  }
  validateSearchModel(): boolean {
    if (
      !this.SearchFilterModel.fromDate ||
      !this.SearchFilterModel.toDate ||
      this.SearchFilterModel.filterItems.length == 0
    ) {
      this.toaster.warning('يرجي ملئ جميع الخانات');
      return false;
    }
    return true;
  }

  costCenterTypeSelected(item)
  {
    this.pageFilter=this.pageFilter.filter(x=>x.categoryName!='costCenterTypeId');
    this.pageFilter.push({
      categoryName:'costCenterTypeId',
      itemKey:item.id?.toString(),
      itemFlag:item.id?.toString()
    });
    this.applyFilterChanges();

  }

}
