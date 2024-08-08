import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { FilterItem, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { CustomValidators } from 'src/app/components/Shared/services/custom-validators';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { EmployeeVacationModel } from 'src/app/components/HR/models/EmployeeVacationModel';
import { EmployeeProfileService } from '../../services/employee-profile.service';


@Component({
  selector: 'app-team-work-vacations',
  templateUrl: './team-work-vacations.component.html',
  styleUrls: ['./team-work-vacations.component.css']
})
export class TeamWorkVacationsComponent implements OnInit {
  VacationData: any[] = [];

  
  CategorySearch: any;
  CategoryName = 'قائمة الموظفين';
  SearchFilterModel: SearchFilterModel = {
    currentPage: 1,
    pageSize: 25,
    filterModel: { filterItems: [] }
  };
  employeeVacationModel: EmployeeVacationModel = {} as EmployeeVacationModel;
  vacationResponse: PagedResponseDTO<EmployeeVacationModel[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: ''

  };
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  selectedVacationId: number;
  selectedEmployeeId: number = null;
  selectedApproveStatus:boolean=false;
  constructor(private modalService: NgbModal, private employeeProfile: EmployeeProfileService, private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.getTeamWorkVacations();
  }

  getTeamWorkVacations() {

    this.showLoader = true;
    this.employeeProfile.GetTeamWorkVacations(this.vacationResponse).subscribe(data => {
      this.vacationResponse.results = data.results;
      this.vacationResponse.totalCount = data.totalCount;

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });


  }




  filterChecked(filterItems: FilterItem[]) {
    this.vacationResponse.filterList = filterItems;
    this.getTeamWorkVacations();
  }

  pageChanged(obj: any) {
    this.vacationResponse.currentPage = obj.page;
    this.getTeamWorkVacations();
  }

  openApproveModal(content: any, vacationId: number, employeeId: number,approveStatus:boolean) {
    this.selectedVacationId = vacationId;
    this.selectedEmployeeId = employeeId;
    this.selectedApproveStatus=approveStatus;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  approveVacation() {
    this.showAddLoader = true;
    this.employeeProfile.ApproveVacation(this.selectedVacationId,this.selectedEmployeeId,this.selectedApproveStatus).subscribe(data => {

      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getTeamWorkVacations();
        this.toaster.success(data?.message);
      }
      else {
        this.toaster.error(data?.message);
      }
      this.showAddLoader = false;
    }, err => {
      this.showAddLoader = false;
    }, () => {
      this.showAddLoader = false;
    });
  }
}
