import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from '../../services/inventory.service';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit {
  Units: any[] = [];
  TitleList = ['المخازن', 'بيانات الوحدات'];
  //form: FormGroup;
  showLoader: boolean;
  TotalCount: any;
  TotalPages: any;
  UnitId: any;
  SearchText: any = "";
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25
  };

  pagedResponseModel: PagedResponseDTO<any[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: ''
  };

  constructor(private invenService: InventoryService,
    private modalService: NgbModal,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    //this.UserModel = JSON.parse(localStorage.getItem('UserModel') as any);
    //this.FormInit();
    this.getUnits();
    //this.GetRawItemCategories();
  }

  open(content: any) {
    this.modalService.open(content, { size: 'lg', centered: true, scrollable: true });
  }

  deleteUnit(content: any, unitId: any) {
    this.UnitId = unitId;
    this.modalService.open(content, { size: 'md', centered: true });
  }

  getUnits() {
    this.invenService.GetUnits().subscribe(data => {
      this.Units = data;
      this.TotalCount = data && data.length > 0 && (data[0].matchCount != null || data[0].matchCount != undefined) ? data[0].matchCount : 0;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }

  // getMaterialReceipts_Data() {
  //   this.showLoader = true;
  //   this.inventoryService.GetMaterialReceipts_Data(this.pagedResponseModel).subscribe(data => {
  //     this.pagedResponseModel.results = data.results;
  //     this.pagedResponseModel.totalCount = data.totalCount;
  //     this.showLoader = false;
  //   }, (err) => {
  //     this.showLoader = false;
  //   }, () => {
  //     this.showLoader = false;
  //   })
  // }

  pageChanged(obj: any) {
    this.FilterModel.currentPage = obj.page;
    this.getUnits();
  }

  DeleteRawItem(UnitId: any) {
    this.invenService.DeleteUnit(UnitId).subscribe(data => {
      if (data.item1 == 200) {
        this.toaster.success('Delete Successfully');
        this.getUnits();
      } else {
        this.toaster.error('Error Happened! ');
      }
    });
  }

}
