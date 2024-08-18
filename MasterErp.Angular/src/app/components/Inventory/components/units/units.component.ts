import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from '../../services/inventory.service';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';

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

  constructor(private invenService: InventoryService,
    private modalService: NgbModal,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    //this.UserModel = JSON.parse(localStorage.getItem('UserModel') as any);
    //this.FormInit();
    this.getUnits();
    //this.GetRawItemCategories();
  }

  deleteUnit(content: any, unitId: any) {
    this.UnitId = unitId;
    this.modalService.open(content, { size: 'md', centered: true });
  }

  getUnits() {
    this.invenService.GetUnits().subscribe(data => {
      debugger;
      this.Units = data;
      this.TotalCount = data && data.length > 0 && (data[0].matchCount != null || data[0].matchCount != undefined) ? data[0].matchCount : 0;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }

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
