import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { EmployeeModel } from '../../models/Employee/EmployeeModel';
import { EmployeeService } from '../../services/employee.service';
import { environment } from 'src/environments/environment';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';
import { ToastrService } from 'ngx-toastr';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';

@Component({
  selector: 'app-hr-employee-details-container',
  templateUrl: './hr-employee-details-container.component.html',
  styleUrls: ['./hr-employee-details-container.component.css']
})
export class HrEmployeeDetailsContainerComponent implements OnInit {

  @Input() employeeId: number;
  employeeBasicInfoModel: EmployeeModel = {} as EmployeeModel;
  showLoader: boolean = false;
  queryParams: any = {};
  systemUrl: string = environment.systemUrl;
  defaultImage = `${this.systemUrl}assets/images/av-8.png`;
  employeeStatusSelector: GeneralSelectorModel[] = [];
  constructor(private acRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private lookupService: LookupService,
    private toaster: ToastrService,
    private sharedService: SharedService,) { }

  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((params: any) => {
      this.queryParams = params;
      if (params.EmployeeId) {
        this.employeeId = params.EmployeeId;
        this.getEmployeeBasicInfo();
      }
    });
    this.getEmployeeStatusSelector();
  }


  getEmployeeBasicInfo() {
    this.showLoader = true;
    this.employeeService.GetEmployeeBasicInfoById(this.employeeId).subscribe((data: EmployeeModel) => {
      if (data) {
        this.employeeBasicInfoModel = data;
      }

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });


  }

  getEmployeeStatusSelector() {
    this.showLoader = true;
    this.lookupService.GetEmployeeStatusSelector().subscribe((data: any[]) => {
      if (data) {
        this.employeeStatusSelector = data;
      }

    }, err => {
    }, () => {
    });

  }

  onStatusChanged(status: GeneralSelectorModel) {

    this.showLoader = true;
    this.employeeService.ChangeEmployeeStatus(this.employeeBasicInfoModel?.employeeId, status?.value).subscribe((data: ActionsResponseModel) => {
      if (data.isSuccess) {

        this.getEmployeeBasicInfo();
        this.toaster.success(data.message);
      }
      else {
        this.toaster.error(data.message);
      }
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

}
