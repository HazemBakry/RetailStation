
import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { FilterItem, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { EmployeeProfileService } from '../../services/employee-profile.service';
import { EmployeeBasicInfoModel } from '../../models/EmployeeBasicInfoModel';

@Component({
  selector: 'app-team-work',
  templateUrl: './team-work.component.html',
  styleUrls: ['./team-work.component.css']
})
export class TeamWorkComponent implements OnInit {
  
  SearchFilterModel: SearchFilterModel = {
    currentPage: 1,
    pageSize: 25,
    filterModel: { filterItems: [] }
  };
  employeeBasicInfoModel: EmployeeBasicInfoModel = {} as EmployeeBasicInfoModel;
  employeeBasicInfoResponse: PagedResponseDTO<EmployeeBasicInfoModel[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: ''

  };
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  selectedLoanId: number;
  selectedEmployeeId: number = null;
  selectedApproveStatus:boolean=false;
  constructor(private modalService: NgbModal, private employeeProfile: EmployeeProfileService, private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.getTeamWorkData();
  }

  getTeamWorkData() {

    this.showLoader = true;
    this.employeeProfile.GetTeamWork(this.employeeBasicInfoResponse).subscribe(data => {
      this.employeeBasicInfoResponse.results = data.results;
      this.employeeBasicInfoResponse.totalCount = data.totalCount;

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });


  }

  filterChecked(filterItems: FilterItem[]) {
    this.employeeBasicInfoResponse.filterList = filterItems;
    this.getTeamWorkData();
  }

  pageChanged(obj: any) {
    this.employeeBasicInfoResponse.currentPage = obj.page;
    this.getTeamWorkData();
  }


}
