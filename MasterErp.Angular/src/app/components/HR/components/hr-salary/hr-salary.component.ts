import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HrService } from '../../services/hr.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { ToastrService } from 'ngx-toastr';
import { EmployeeSalaryModel } from '../../models/Employee/EmployeeSalaryModel';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-hr-salary',
  templateUrl: './hr-salary.component.html',
  styleUrls: ['./hr-salary.component.css']
})
export class HrSalaryComponent implements OnInit {
  selectAll: boolean = false;
  suppliersSelectorData: FormDropdownModel[] = [];
  menuItems = [
    { name: 'Dashboard', checked: false },
    { name: 'Profile', checked: false },
    { name: 'Settings', checked: false },
    { name: 'Messages', checked: false },
    { name: 'Notifications', checked: false },
  ];
  TitleList = ['ألموارد البشرية', 'الرواتب'];
  EmployeeSalaryData: EmployeeSalaryModel[] = [];
  EmployeeData: any[] = [];
  BranchId: number;
  branchesSelectorData: FormDropdownModel[] = [];
  ExecutonDate: any;
  public formGroup: FormGroup;
  public formErrors = {
    branchIds: ''
  };

  constructor(private modalService: NgbModal, private hrService: HrService,
    private sharedService: SharedService, private toaster: ToastrService, private datepipe: DatePipe,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadBranches();
    let date = new Date();
    this.ExecutonDate = this.datepipe.transform(date, 'yyyy-MM-dd');
    //this.getEmployeesSalaryByBranch();
  }

  loadBranches() {
    this.sharedService.GetBranchesSelector().subscribe((data: FormDropdownModel[]) => {
      this.branchesSelectorData = data;
    });
  }

  getSelectedBranch(supplierId) {
    //this.selectedSupplierId=supplierId;
  }

  getEmployeesSalaryByBranch() {
    var checkedItems = this.branchesSelectorData.filter(b => b.isSelected && b.value).map(b => b.value);
    if (checkedItems.length <= 0) {
      this.toaster.warning('يرجي الاختيار من الفروع');
      return;
    }
    this.hrService.GetEmployeesSalaryByBranch(checkedItems, this.ExecutonDate).subscribe(data => {

      this.EmployeeSalaryData = data;
    });
  }

  selectAllData() {
    if (this.branchesSelectorData && this.branchesSelectorData.length > 0) {
      this.branchesSelectorData.map(c => {
        c.isSelected = this.selectAll;
      });
    }

  }
}
