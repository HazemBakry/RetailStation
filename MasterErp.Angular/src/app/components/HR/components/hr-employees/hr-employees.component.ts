import { Component, OnInit } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SaveEmployeeModel } from 'src/app/components/HR/models/SaveEmployeeModel';
import { HrService } from '../../services/hr.service';
@Component({
  selector: 'app-hr-employees',
  templateUrl: './hr-employees.component.html',
  styleUrls: ['./hr-employees.component.css']
})
export class HrEmployeesComponent implements OnInit {
  IqamaIssueList: any[] = [];
  PassportIssueList: any[] = [];
  SponsorList: any[] = [];
  IqamaJobList: any[] = [];
  NationalityList: any[] = [];
  JobList: any[] = [];
  BranchList: any[] = [];
  BankList: any[] = [];
  URLs: any[] = [];
  SaveEmployeeModel: SaveEmployeeModel = {
    employee: {},
    employeeContract: {},
    employeeSalary: {}
  } as SaveEmployeeModel;
  active = 1;
  DefaultImage = '../../../../assets/images/default-image.png';

  constructor(private offcanvasService: NgbOffcanvas, private hrService: HrService) { }

  ngOnInit(): void {
    this.GetIqamaIssuePlaceData();
    this.GetPassportIssuePlaceData();
    this.GetSponsorData();
    this.GetIqamaJobData();
    this.GetNationalityData();
    this.GetJobData();
    this.GetBranchData();
    this.GetBankData();
    this.resetEmployeeModel();

  }

  resetEmployeeModel() {
    this.SaveEmployeeModel = {
      employee: {},
      employeeContract: {},
      employeeSalary: {}
    }
    this.SaveEmployeeModel.employee.iqamaIssuePlaceId = 0;
    this.SaveEmployeeModel.employee.iqamaJobId = 0;
    this.SaveEmployeeModel.employee.nationalityId = 0;
    this.SaveEmployeeModel.employee.sponsorId = 0;
    this.SaveEmployeeModel.employee.jobId = 0;
    this.SaveEmployeeModel.employee.branchId = 0;
    this.SaveEmployeeModel.employee.bankId = 0;
    this.SaveEmployeeModel.employee.passportIssunacePlace = '';
  }

  onActive(index: number) {
    if (index === 1) {
      this.active = 1;
    } else if (index === 2) {
      this.active = 2;
    } else if (index === 3) {
      this.active = 3;
    } else
      this.active = 4;

  }

  OpenDetailsSidePanel(content: any) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  GetIqamaIssuePlaceData() {
    this.hrService.GetIqamaIssuePlaceData().subscribe(data => {
      this.IqamaIssueList = data;
    });
  }

  GetPassportIssuePlaceData() {
    this.hrService.GetPassportIssuePlaceData().subscribe(data => {
      this.PassportIssueList = data;
    });
  }

  GetSponsorData() {
    this.hrService.GetSponsorData().subscribe(data => {
      this.SponsorList = data;
    });
  }

  GetIqamaJobData() {
    this.hrService.GetIqamaJobData().subscribe(data => {
      this.IqamaJobList = data;
    });
  }

  GetNationalityData() {
    this.hrService.GetNationalityData().subscribe(data => {
      this.NationalityList = data;
    });
  }

  GetJobData() {
    this.hrService.GetJobData().subscribe(data => {
      this.JobList = data;
    });
  }

  GetBranchData() {
    this.hrService.GetBranchData().subscribe(data => {
      this.BranchList = data;
    });
  }

  GetBankData() {
    this.hrService.GetBankData().subscribe(data => {
      this.BankList = data;
    });
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
  }

  SaveEmployeeDate() {
    console.log(this.SaveEmployeeModel);

    // this.hrService.AddNewEmployee(this.SaveEmployeeModel).subscribe(data => {

    // })

  }
}
