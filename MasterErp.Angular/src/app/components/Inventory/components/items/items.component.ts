import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from '../../services/inventory.service';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  Units: any[] = [];
  ItemCategoriesData: any[] = [];
  TitleList = ['المخازن', 'بيانات الأصناف'];
  //form: FormGroup;
  Items: any[] = [];
  showLoader: boolean;
  TotalCount: any;
  TotalPages: any;
  CategoryId: number = 0;
  CategoryName: any;
  ItemId: any;
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
    this.GetItemsList();
    //this.GetItemCategories();
  }

  deleteItem(content: any, itemId: any) {
    this.ItemId = itemId;
    this.modalService.open(content, { size: 'md', centered: true });
  }

  GetItemsList() {
    this.invenService.GetItemsList(this.CategoryId, this.SearchText).subscribe(data => {
      this.Items = data;
      this.TotalCount = data && data.length > 0 && (data[0].matchCount != null || data[0].matchCount != undefined) ? data[0].matchCount : 0;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }

  GetItemCategories() {
    this.invenService.GetItemCategories().subscribe(data => {
      this.ItemCategoriesData = data;
    });
  }

  pageChanged(obj: any) {
    this.FilterModel.currentPage = obj.page;
    this.GetItemsList();
  }

  DeleteItem(ItemId: any) {
    this.invenService.DeleteItem(ItemId).subscribe(data => {
      if (data.item1 == 200) {
        this.toaster.success('Delete Successfully');
        this.GetItemsList();
      } else {
        this.toaster.error('Error Happened! ');
      }
    });
  }

  onCategoryClick(item: any) {
    this.CategoryName = item.nameEn;
    this.CategoryId = item.id;
    this.GetItemsList();
  }

  ExportItems() {
    let user = ""; //this.UserModel?.fullName
    this.invenService.ExportItems(this.CategoryId, this.SearchText, user).subscribe(data => {
      if (data.url != null) {
        window.location.href = data.url;
        this.toaster.success("File exported successfully");
      } else {
        this.toaster.error("an Error happened , file can not export");
      }
    });
  }

}
