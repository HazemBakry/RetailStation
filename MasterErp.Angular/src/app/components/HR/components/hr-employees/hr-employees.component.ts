import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SaveEmployeeModel } from 'src/app/components/HR/models/SaveEmployeeModel';
import { HrService } from '../../services/hr.service';
import { FilterItem, FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from 'src/app/components/Shared/services/validation.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { Router } from '@angular/router';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { EmployeeModel } from '../../models/Employee/EmployeeModel';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-hr-employees',
  templateUrl: './hr-employees.component.html',
  styleUrls: ['./hr-employees.component.css']
})
export class HrEmployeesComponent implements OnInit {
  URLs: any[] = [];
  ImagesName: any[] = [];
  Branches: any[] = [];
  filterList: FilterModel[] = [];
  TitleList = ['Users', 'Users'];
  BranchName = 'Branches';
  systemUrl:string=environment.systemUrl
  defaultImage = `${this.systemUrl}assets/images/av-8.png`;

  SearchText = '';
  totalCount: any;
  totalPages: any;
  pageSize: any = 8;
  currentPage: any = 1;
  StartIndex = 0;
  BranchValidate = false;
  selectedEmployee: any;
  showLoader: boolean=false;

  pagedResponseModel:PagedResponseDTO<EmployeeModel[]>={
    results:[],
    filterList:[],
    pageSize: 25,
    currentPage:1,
    searchText:''

  };
  constructor(private modalService: NgbModal, private toaster: ToastrService, private hrService: HrService, private router: Router,
    private validationService: ValidationService, private sharedService: SharedService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getAllEmployees();
    this.getEmployeesFilter();
    this.getBranches();
  }

  getAllEmployees() {
    //this.pagedResponseModel.SearchText = this.SearchText;
    this.hrService.GetAllEmployees(this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data?.results;
      this.pagedResponseModel.totalCount = data?.totalCount;
      this.pagedResponseModel.results = data?.results;
      if (this.pagedResponseModel.results.length > 0) {
        this.showEmployeeCardData(this.pagedResponseModel.results[0]);
      }

    }, err=>{
      this.showLoader=false;
    },()=>{
      this.showLoader=false;
    });
  }

  goToEmployeeDetails(employeeId: any) {
    this.router.navigateByUrl('/hr/employee-details?EmployeeId=' + employeeId);
  }

  getEmployeesFilter() {
    this.hrService.GetEmployeesFilter(this.pagedResponseModel).subscribe(data => {
      this.filterList = data;
    });
  }

  getBranches() {
    this.hrService.GetBranchData().subscribe(data => {
      this.Branches = data;
    });
  }

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.getAllEmployees();
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
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

  showEmployeeCardData(item: EmployeeModel) {
    this.pagedResponseModel.results.map(emp => {
      emp.isChecked = false;
    });
    item.isChecked = true;
    this.selectedEmployee = item;
    
  }

}
