import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HrService } from '../../services/hr.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';

@Component({
  selector: 'app-hr-salary',
  templateUrl: './hr-salary.component.html',
  styleUrls: ['./hr-salary.component.css']
})
export class HrSalaryComponent implements OnInit {
  TitleList = ['ألموارد البشرية', 'الرواتب'];
  EmployeeSalaryData: any[] = [];
  EmployeeData: any[] = [];
  BranchId: number;
  branchesSelectorData: FormDropdownModel[] = [];
  
  public formGroup: FormGroup;
  public formErrors = {
    branchIds:''
  };

  constructor(private modalService: NgbModal, private hrService: HrService, 
    private sharedService: SharedService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadSelectors();
    //this.getEmployeesSalaryByBranch();
  }

  loadSelectors() {
    this.sharedService.GetBranchesSelector().subscribe((data: FormDropdownModel[]) => {
      this.branchesSelectorData = data;
    });
  }

  getSelectedBranch(supplierId)
  {
    //this.selectedSupplierId=supplierId;
  }

  getEmployeesSalaryByBranch() {
    this.hrService.GetEmployeesSalaryByBranch().subscribe(data => {
      this.EmployeeSalaryData = data;
    });
  }
}
