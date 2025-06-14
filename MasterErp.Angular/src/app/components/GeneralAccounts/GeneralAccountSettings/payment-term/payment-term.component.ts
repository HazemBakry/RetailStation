import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { GeneralAccountSettingsService } from '../../services/general-account-settings.service';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { PaymentTermDetailsModel, PaymentTermModel } from '../../models/GeneralAccounts/PaymentTermModel';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';


@Component({
  selector: 'app-payment-term',
  templateUrl: './payment-term.component.html',
  styleUrls: ['./payment-term.component.css']
})
export class PaymentTermComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'شروط السداد'];
  @ViewChild('PaymentTermsSidePanel') SidePanel: HTMLElement;

  Today: Date = new Date();
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  showAddDetailsLoader: boolean = false;
  showDetailsLoader: boolean = false;
  paymentTermDetails: PaymentTermDetailsModel[] = [];
  pagedResponse: PagedResponseDTO<PaymentTermModel[]> = {
    currentPage: 1,
    pageSize: 10,
    results: [],
    filterList: [],
    searchText: ''
  }
  paymentTermModel: PaymentTermModel =
    {} as PaymentTermModel;

  constructor(private modalService: NgbModal, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,
    private form: FormBuilder, private _FormService: FormService, private generalAccountSettingsService: GeneralAccountSettingsService) { }

  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.showLoader = true;
    this.generalAccountSettingsService.GetPaymentTermsData(this.pagedResponse).subscribe((data: any) => {
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
    paymentTermId: '',
    paymentTermDetailsId: '',
    nameAR: '',
    nameEN: '',
    isActive: '',
    duePercentage: '',
    dueAfterDays: '',

  };
  selectedPaymentTermId: number;
  openAddModal(content: any, paymentTermModel: PaymentTermModel = null) {
    this.loadSelectors();
    this.isUpdate = false;
    this.buildForm();
    if (paymentTermModel)
      this.fillEditForm(paymentTermModel);

    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });
  }
  loadSelectors() {

  }
  buildForm() {
    this.formGroup = this.form.group({
      paymentTermId: [null],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      isActive: [true, [Validators.required]],
      // duePercentage: [null, [Validators.required]],
      // dueAfterDays: [null, [Validators.required]],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
  }


  saveRecord() {
    if (!this.validateForm()) {
      return;
    }
    this.paymentTermModel = this.formGroup.value;
    if (this.paymentTermModel?.paymentTermId)
      this.editNewPaymentTerm();
    else
      this.addNewPaymentTerm();
  }

  addNewPaymentTerm() {

    this.showAddLoader = true;
    this.generalAccountSettingsService
      .CreateNewPaymentTerm(this.paymentTermModel).subscribe(data => {
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

  editNewPaymentTerm() {


    this.showAddLoader = true;
    this.generalAccountSettingsService
      .EditPaymentTerm(this.paymentTermModel.paymentTermId, this.paymentTermModel).subscribe(data => {

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

  fillEditForm(paymentTermModel: PaymentTermModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      paymentTermId: paymentTermModel.paymentTermId,
      nameAR: paymentTermModel.nameAR,
      nameEN: paymentTermModel.nameEN,
      isActive: paymentTermModel.isActive
    });
  }
  openDeleteModal(content: any, id: number) {
    this.selectedPaymentTermId = id;
    this.modalService.open(content, { centered: true, size: 'sm' });
  }

  deletePaymentTerm() {
    this.showAddLoader = true;
    this.generalAccountSettingsService.DeletePaymentTerm(this.selectedPaymentTermId).subscribe(data => {

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

  changePaymentTermStatus(item: PaymentTermModel) {
    this.generalAccountSettingsService.ChangePaymentTermStatus(item.paymentTermId, item.isActive).subscribe(data => {
      if (data?.isSuccess) {
        this.toaster.success(data?.message);
      }
      else
        this.toaster.error(data?.message);
    })
  }

  openPaymentTermsSidePanel(item: PaymentTermModel) {
    this.paymentTermDetails = [];
    this.paymentTermModel = item;
    this.selectedPaymentTermId = item.paymentTermId;
    this.GetPaymentTermDetailsById();
    this.offcanvasService.open(this.SidePanel, { position: 'end' });
  }
  GetPaymentTermDetailsById() {
    this.showDetailsLoader = true;
    this.generalAccountSettingsService.GetPaymentTermDetailsById(this.selectedPaymentTermId).subscribe(data => {
      this.paymentTermDetails = data;
      this.showDetailsLoader = false;
    }, err => {
      this.showDetailsLoader = false;
    }, () => {
      this.showDetailsLoader = false;
    });
  }




  /////////////////////////////// Details




  isDetailsUpdate: boolean = false;
  public detailsFormGroup: FormGroup;
  selectedPaymentTermDetailsId: number;
  paymentTermDetailsModel: PaymentTermDetailsModel = {} as PaymentTermDetailsModel;
  openAddDetailsModal(content: any, paymentTermDetailsModel: PaymentTermDetailsModel = null) {
    this.loadSelectors();
    this.isUpdate = false;
    this.buildDetailsForm();
    if (paymentTermDetailsModel)
      this.fillEditDetailsForm(paymentTermDetailsModel);

    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });
  }
  buildDetailsForm() {
    this.detailsFormGroup = this.form.group({
      paymentTermDetailsId: [null],
      paymentTermId: [this.selectedPaymentTermId],
      duePercentage: [null, [Validators.required,CustomValidators.regexPattern(RegexType.number), Validators.min(0),Validators.max(100)]],
      dueAfterDays: [null, [Validators.required,CustomValidators.regexPattern(RegexType.number), Validators.min(0),Validators.max(30)]],
    });
    this.detailsFormGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.detailsFormGroup, this.formErrors, true);
    });
  }


  saveDetails() {
    if (!this.validateDetailsForm()) {
      return;
    }
    this.paymentTermDetailsModel = this.detailsFormGroup.value;
    if (this.paymentTermDetailsModel.paymentTermDetailsId)
      this.editPaymentTermDetails();
    else
      this.addNewPaymentTermDetails();
  }

  addNewPaymentTermDetails() {

    this.showAddDetailsLoader = true;
    this.generalAccountSettingsService
      .CreateNewPaymentTermDetails(this.selectedPaymentTermId, this.paymentTermDetailsModel).subscribe(data => {
        if (data?.isSuccess) {
          this.detailsFormGroup?.reset();
          this.modalService?.dismissAll();
          this.GetPaymentTermDetailsById();
          this.toaster.success(data?.message);
        }
        else {
          this.toaster.error(data?.message);
        }
        this.showAddDetailsLoader = false;
      }, err => {
        this.showAddDetailsLoader = false;
      }, () => {
        this.showAddDetailsLoader = false;
      });



  }

  editPaymentTermDetails() {


    this.showAddDetailsLoader = true;
    this.generalAccountSettingsService
      .EditPaymentTermDetails(this.paymentTermDetailsModel.paymentTermDetailsId, this.paymentTermDetailsModel).subscribe(data => {

        if (data?.isSuccess) {
          // this.formGroup?.reset();
          this.isDetailsUpdate = false;
          this.modalService?.dismissAll();
          this.detailsFormGroup?.reset();
          this.toaster.success(data?.message);

          this.GetPaymentTermDetailsById();
        }
        else {
          this.toaster.error(data?.message);
        }
        this.showAddDetailsLoader = false;
      }, err => {
        this.showAddDetailsLoader = false;
      }, () => {
        this.showAddDetailsLoader = false;
      });


  }

  validateDetailsForm(): boolean {
    this._FormService.markFormGroupTouched(this.detailsFormGroup);
    if (this.detailsFormGroup.valid) {
      return true;
    } else {
      this.formErrors = this._FormService.validateForm(this.detailsFormGroup, this.formErrors, false)
      return false;
    }
  }

  fillEditDetailsForm(paymentTermDetailsModel: PaymentTermDetailsModel) {
    this.isDetailsUpdate = true;

    this.detailsFormGroup.patchValue({
      paymentTermDetailsId: paymentTermDetailsModel.paymentTermDetailsId,
      paymentTermId: paymentTermDetailsModel.paymentTermId,
      duePercentage: paymentTermDetailsModel.duePercentage,
      dueAfterDays: paymentTermDetailsModel.dueAfterDays,
    });
  }
  openDeleteDetailsModal(content: any, id: number) {
    this.selectedPaymentTermDetailsId = id;
    this.modalService.open(content, { centered: true, size: 'sm' });
  }

  deletePaymentTermDetails() {
    this.showAddDetailsLoader = true;
    this.generalAccountSettingsService.DeletePaymentTermDetails(this.selectedPaymentTermDetailsId).subscribe(data => {

      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.GetPaymentTermDetailsById();
        this.toaster.success(data?.message);
      }
      else {
        this.toaster.error(data?.message);
      }
      this.showAddDetailsLoader = false;
    }, err => {
      this.showAddDetailsLoader = false;
    }, () => {
      this.showAddDetailsLoader = false;
    });
  }


}
