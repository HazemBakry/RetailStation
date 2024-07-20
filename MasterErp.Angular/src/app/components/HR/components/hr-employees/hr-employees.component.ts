import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SaveEmployeeModel } from 'src/app/components/HR/models/SaveEmployeeModel';
import { HrService } from '../../services/hr.service';
import { FilterItem, FilterModel, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from 'src/app/components/Shared/services/validation.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
@Component({
  selector: 'app-hr-employees',
  templateUrl: './hr-employees.component.html',
  styleUrls: ['./hr-employees.component.css']
})
export class HrEmployeesComponent implements OnInit {
  ResultData: any[] = [];
  URLs: any[] = [];
  ImagesName: any[] = [];
  Branches: any[] = [];
  filterList: FilterModel[] = [];
  TitleList = ['Users', 'Users'];
  BranchName = 'Branches';
  DefaultImage = '../../../../../assets/av-8.png';
  SearchText = '';
  UserModel: any;
  totalCount: any;
  totalPages: any;
  pageSize: any = 8;
  currentPage: any = 1;
  StartIndex = 0;
  BranchValidate = false;
  SelectedEmployee : any;
  SearchFilterModel: SearchFilterModel = {
    currentPage: 1,
    pageSize: 25,
    filterModel: { filterItems: [] }
  };

  constructor(private modalService: NgbModal, private toaster: ToastrService, private hrService: HrService,
    private validationService: ValidationService, private sharedService: SharedService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.UserModel = JSON.parse(localStorage.getItem('UserModel'));
    this.getAllEmployees();
    this.getEmployeesFilter();
    this.getBranches();
  }

  getAllEmployees() {
    //this.SearchFilterModel.SearchText = this.SearchText;
    this.hrService.GetAllEmployees(this.SearchFilterModel).subscribe(data => {
      this.totalCount = data?.totalCount;
      this.ResultData = data?.results;
      // this.ResultData[0].isClicked = true;
      // this.SelectedEmployee = this.ResultData[0];
    });
  }

  getEmployeesFilter() {
    this.hrService.GetEmployeesFilter(this.SearchFilterModel).subscribe(data => {
      this.filterList = data;
    });
  }

  getBranches() {
    this.hrService.GetBranchData().subscribe(data => {
      this.Branches = data;
    });
  }

  filterChecked(filterItems: FilterItem[]) {
     this.SearchFilterModel.filterModel.filterItems = filterItems;
     this.getAllEmployees();
  }

  pageChanged(obj: any) {
    this.SearchFilterModel.currentPage = obj.page;
    this.getAllEmployees();
  }

  // pageChanged(obj: any) {
  //   this.currentPage = obj.page;
  //   this.StartIndex = (this.currentPage - 1) * this.pageSize;
  //   this.pagingUsersData = this.UsersData.slice(this.StartIndex, this.StartIndex + this.pageSize);
  // }

  onBranchClick(branch: any) {
    this.BranchName = branch.nameEn;
    this.BranchValidate = false;
  }

  onSelectedFile(event: any) {
    this.URLs = [];
    if (event.target.files) {
      for (let x = 0; x < event.target.files.length; x++) {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[x]);
        reader.onload = (events: any) => {
          this.URLs.push(events.target.result);
        }
      }
    }
    var files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.ImagesName.push(event.target.files[i].name);
    }
  }

  ShowUserCardData(item: any) {
    this.SelectedEmployee = item;
    this.ResultData.forEach(user => {
      if (item.id == user.id)
        user.isClicked = true;
      else
        user.isClicked = false;
    })
  }

}
