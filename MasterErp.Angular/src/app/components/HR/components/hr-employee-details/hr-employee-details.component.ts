import { Component, OnInit } from '@angular/core';
import { SaveEmployeeModel } from '../../models/SaveEmployeeModel';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { HrService } from '../../services/hr.service';

@Component({
  selector: 'app-hr-employee-details',
  templateUrl: './hr-employee-details.component.html',
  styleUrls: ['./hr-employee-details.component.css']
})
export class HrEmployeeDetailsComponent implements OnInit {
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
    this.getIqamaIssuePlaces();
    this.getPassportIssuePlaces();
    this.getSponsorData();
    this.getIqamaJobData();
    this.getNationalityData();
    this.getJobData();
    this.getBranchData();
    this.getBankData();
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

  getIqamaIssuePlaces() {
    this.hrService.GetIqamaIssuePlaces().subscribe(data => {
      this.IqamaIssueList = data;
    });
  }

  getPassportIssuePlaces() {
    this.hrService.GetPassportIssuePlaces().subscribe(data => {
      this.PassportIssueList = data;
    });
  }

  getSponsorData() {
    this.hrService.GetSponsorData().subscribe(data => {
      this.SponsorList = data;
    });
  }

  getIqamaJobData() {
    this.hrService.GetIqamaJobData().subscribe(data => {
      this.IqamaJobList = data;
    });
  }

  getNationalityData() {
    this.hrService.GetNationalityData().subscribe(data => {
      this.NationalityList = data;
    });
  }

  getJobData() {
    this.hrService.GetJobData().subscribe(data => {
      this.JobList = data;
    });
  }

  getBranchData() {
    this.hrService.GetBranchData().subscribe(data => {
      this.BranchList = data;
    });
  }

  getBankData() {
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

  saveEmployeeDate() {
    console.log(this.SaveEmployeeModel);

    // this.hrService.AddNewEmployee(this.SaveEmployeeModel).subscribe(data => {

    // })

  }
}

