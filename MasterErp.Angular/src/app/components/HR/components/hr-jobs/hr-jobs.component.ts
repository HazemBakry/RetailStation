import { Component, OnInit } from '@angular/core';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';
import { HrService } from '../../services/hr.service';

@Component({
  selector: 'app-hr-jobs',
  templateUrl: './hr-jobs.component.html',
  styleUrls: ['./hr-jobs.component.css']
})
export class HrJobsComponent implements OnInit {



  TitleList = ['الموارد البشرية', 'قائمة الوظائف'];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  pagedResponse: PagedResponseDTO<any[]> = {
    currentPage: 1,
    pageSize: 10,
    results: [],
    filterList: [],
    searchText: ''
  }
  jobModel: any = {} as any;

  constructor(private _hrService: HrService, private toaster: ToastrService,
    private sharedService: SharedService,
    private modalService: NgbModal,
    private lookupService: LookupService,
    private form: FormBuilder,
    private _FormService: FormService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader = true;
    this._hrService.GetJobsData(this.pagedResponse).subscribe((data: any) => {
      this.pagedResponse.results = data.results;
      this.pagedResponse.totalCount = data.totalCount;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }

  pageChanged(obj: any) {
    this.pagedResponse.currentPage = obj.page;
    this.loadData();
  }

  ////////////////////////////  Actions /////////////////////////////


  isUpdate: boolean = false;
  public formGroup: FormGroup;
  public formErrors = {
    jobId: '',
    code: '',
    nameAR: '',
    nameEN: '',
    isActive: ''
  };

  //sponsorTypesSelectorData: GeneralSelectorModel[] = [];
  selectedJobId: number;

  openAddModal(content: any, JobModel: any = null) {
    //this.loadSelectors();
    this.isUpdate = false;
    this.buildForm();
    if (JobModel)
      this.fillEditForm(JobModel);

    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });
  }

  // loadSelectors() {
  //   this.lookupService.GetSponsorTypesSelector().subscribe(data => {
  //     this.sponsorTypesSelectorData = data;
  //   });
  // }

  buildForm() {
    this.formGroup = this.form.group({
      jobId: [null],
      code: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      isActive: [true, [Validators.required]]
    });

    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  saveRecord() {
    if (!this.validateForm()) {
      return;
    }
    this.jobModel = this.formGroup.value;
    if (this.jobModel?.jobId)
      this.editNewJob();
    else
      this.addNewJob();
  }


  addNewJob() {
    this.showAddLoader = true;
    this._hrService
      .CreateNewJob(this.jobModel).subscribe(data => {
        if (data?.isSuccess) {
          this.formGroup?.reset();
          this.modalService?.dismissAll();
          this.loadData();
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

  editNewJob() {
    this.showAddLoader = true;
    this._hrService.EditJob(this.jobModel.jobId, this.jobModel).subscribe(data => {
        if (data?.isSuccess) {
          // this.formGroup?.reset();
          this.isUpdate = false;
          this.modalService?.dismissAll();
          this.formGroup?.reset();
          this.toaster.success(data?.message);
          this.loadData();
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

  validateForm(): boolean {
    this._FormService.markFormGroupTouched(this.formGroup);
    if (this.formGroup.valid) {
      return true;
    } else {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, false)
      return false;
    }
  }

  fillEditForm(JobModel: any) {
    this.isUpdate = true;
    this.formGroup.patchValue({
      jobId: JobModel.jobId,
      code: JobModel.code,
      nameAR: JobModel.nameAR,
      nameEN: JobModel.nameEN,
      isActive: JobModel.isActive,
    });
  }

  openDeleteModal(content: any, id: number) {
    this.selectedJobId = id;
    this.modalService.open(content, { centered: true, size: 'sm' });
  }

  deleteJob() {
    this.showAddLoader = true;
    this._hrService.DeleteJob(this.selectedJobId).subscribe(data => {
      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.loadData();
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
