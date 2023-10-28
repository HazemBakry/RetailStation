import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from '../../services/inventory.service';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';

@Component({
  selector: 'app-raw-items',
  templateUrl: './raw-items.component.html',
  styleUrls: ['./raw-items.component.css']
})
export class RawItemsComponent implements OnInit {
  Units: any[] = [];
  RawCategoriesData: any[] = [];
  TitleList = ['المخازن', 'بيانات الأصناف'];
  //form: FormGroup;
  RawItems: any[] = [];
  showLoader: boolean;
  TotalCount: any;
  TotalPages: any;
  CategoryId: any;
  CategoryName: any;
  ItemId: any;
  SearchText: any;
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
    this.GetRawItems();
    this.GetRawItemCategories();
  }

  // FormInit() {
  //   this.form = this.fb.group({
  //     rawItemId: null,
  //     nameAr: null,
  //     nameEn: null,
  //     cost: null,
  //     unitId: null,
  //     isActive: false,
  //   });
  // }

  // FillEditForm(item: any) {
  //   this.form.setValue({
  //     rawItemId: item.rawItemId,
  //     nameAr: item.nameAr,
  //     nameEn: item.nameEn,
  //     cost: item.cost,
  //     unitId: item.unitId,
  //     isActive: item.isActive,
  //   });
  // }

  deleteRawItem(content: any, itemId: any) {
    this.ItemId = itemId;
    this.modalService.open(content, { size: 'md', centered: true });
  }

  GetRawItems() {
    this.invenService.GetRawItems(this.CategoryId, this.SearchText).subscribe(data => {
      this.RawItems = data;
      this.TotalCount = data && data.length > 0 && (data[0].matchCount != null || data[0].matchCount != undefined) ? data[0].matchCount : 0;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }

  GetRawItemCategories() {
    this.invenService.GetRawItemCategories().subscribe(data => {
      this.RawCategoriesData = data;
    });
  }

  pageChanged(obj: any) {
    this.FilterModel.currentPage = obj.page;
    this.GetRawItems();
  }

  DeleteRawItem(ItemId: any) {
    this.invenService.DeleteRawItem(ItemId).subscribe(data => {
      if (data.item1 == 200) {
        this.toaster.success('Delete Successfully');
        this.GetRawItems();
      } else {
        this.toaster.error('Error Happened! ');
      }
    });
  }

  onCategoryClick(item: any) {
    this.CategoryName = item.nameEn;
    this.CategoryId = item.id;
    this.GetRawItems();
  }

  ExportRawItems() {
    let user = ""; //this.UserModel?.fullName
    this.invenService.ExportRawItems(this.CategoryId, this.SearchText, user).subscribe(data => {
      if (data.url != null) {
        window.location.href = data.url;
        this.toaster.success("File exported successfully");
      } else {
        this.toaster.error("an Error happened , file can not export");
      }
    });
  }

}
