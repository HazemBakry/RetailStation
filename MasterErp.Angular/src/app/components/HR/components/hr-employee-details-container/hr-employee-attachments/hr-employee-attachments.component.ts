import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { CustomValidators } from 'src/app/components/Shared/services/custom-validators';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';
import { HrService } from '../../../services/hr.service';
import { EmployeeAttachmentModel } from '../../../models/Employee/EmployeeAttachmentModel';

@Component({
  selector: 'app-hr-employee-attachments',
  templateUrl: './hr-employee-attachments.component.html',
  styleUrls: ['./hr-employee-attachments.component.css']
})
export class HrEmployeeAttachmentsComponent implements OnInit {


  @Input() employeeId: number;
  employeeAttachmentModel: EmployeeAttachmentModel = {} as EmployeeAttachmentModel;
  isUpdate: boolean = false;

  showLoader: boolean = false;
  showAddLoader: boolean = false;

  public formGroup: FormGroup;
  selectedFile: File;
  attachmentFiles: File[] = [];
  formData: FormData = new FormData();
  public formErrors = {
    employeeContractId: '',
    employeeId: '',
    files: ''
  };


  constructor(private acRoute: ActivatedRoute, private hrService: HrService, private modalService: NgbModal, private employeeService: EmployeeService, private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.EmployeeId) {
        this.employeeId = params.EmployeeId;
        this.getEmployeeAttachments();
      }
    })


    this.initNewForm();
    this.loadSelectors();
  }


  getEmployeeAttachments() {
    this.showLoader = true;
    this.employeeService.GetEmployeeAttachmentsById(this.employeeId).subscribe((data: EmployeeAttachmentModel) => {
      if (data) {
        this.employeeAttachmentModel = data;
        this.initNewForm(this.employeeAttachmentModel);
      }

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });


  }

  downloadFile(url:string)
  {
    this.sharedService.urlDownloadOrOpen(url);
  }
  initNewForm(employeeAttachmentModel: EmployeeAttachmentModel = null) {
    this.formData = new FormData();
    this.attachmentFiles=[];
    this.isUpdate = false;
    this.buildForm();

  }
  buildForm() {
    this.formGroup = this.form.group({
      employeeAttachmentId: [null],
      files: [[] as File[], [Validators.required]]

    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
  }

  saveEmployeeAttachments() {
    if (!this.validateForm()) {
      return;
    }
    this.employeeAttachmentModel = this.formGroup.value;

    if (this.employeeId)
      this.uploadEmployeeMultiFiles();
    else
      this.toaster.warning('please add basic info first', 'Warning');
  }




  uploadEmployeeMultiFiles() {

    this.formData = new FormData();
    if (this.attachmentFiles.length > 0) {
      for (const file of this.attachmentFiles) {
        this.formData.append('files', file);
      }
    }
    else
      return;

    // Object.keys(this.formGroup.value).forEach(key => {
    //   if (key != 'files'&& this.formGroup.value[key])
    //     this.formData.append(key, this.formGroup.value[key]);
    // });

    this.showAddLoader = true;
    this.employeeService.SaveEmployeeAttachments(this.employeeId, this.formData).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.attachmentFiles = [];
        this.formGroup?.reset();
        this.initNewForm();
        this.toaster.success(data?.message);
        this.getEmployeeAttachments();
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
  loadSelectors() {

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


  fillEditForm(employeeAttachmentModel: EmployeeAttachmentModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      employeeId: this.employeeId,
      employeeContractId: employeeAttachmentModel.employeeAttachmentId
    });
  }


  updateFieldsRequiredValidation() {
    this.formGroup.get('uploadType').valueChanges.subscribe(data => {

      const type = this.formGroup.get('type');

      if (data == 'status') {
        type.clearValidators();
        type.setValidators([Validators.required]);

      } else {
        type.clearValidators();
      }

      type.updateValueAndValidity();

    });
  }


  removeSelectedFile(sFile: File) {
    this.attachmentFiles = Array.from(this.attachmentFiles)?.filter(file => file.name !== sFile.name);

    if (this.attachmentFiles?.length == 0)
      this.formGroup?.patchValue({ attachmentFiles: null });
  }

  onFileChange(event: any) {
    this.attachmentFiles = event.target.files;
    //this.documentsFileName = event.target.files[0].name;
  }
}
