import { Component, OnInit } from '@angular/core';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ToastrService } from 'ngx-toastr';
import { GeneralAccountService } from '../../services/general-account.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { JournalEntryTypeModel, } from '../../models/JournalEntryTypeModel';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { PaymentService } from '../../services/payment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CustomValidators } from 'src/app/components/Shared/services/custom-validators';
import { FormService } from 'src/app/components/Shared/services/form.service';


@Component({
  selector: 'app-journal-entry-types',
  templateUrl: './journal-entry-types.component.html',
  styleUrls: ['./journal-entry-types.component.css']
})

export class JournalEntryTypesComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'أنواع القيود'];

  showLoader: boolean = false;
  showAddLoader: boolean = false;

  pagedResponse: PagedResponseDTO<JournalEntryTypeModel[]> = {
    currentPage: 1,
    pageSize: 10,
    results: [],
    filterList: [],
    searchText: ''
  }
  journalEntryTypeModel: JournalEntryTypeModel = {} as JournalEntryTypeModel;

  constructor(private GeneralAccountsService: GeneralAccountService, private toaster: ToastrService,
    private sharedService: SharedService,
    private modalService: NgbModal,
    private paymentService: PaymentService,
    private form: FormBuilder,
    private _FormService: FormService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader = true;
    this.GeneralAccountsService.GetJournalEntryTypesData(this.pagedResponse).subscribe((data: any) => {
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
    journalTypeId: '',
    code: '',
    nameAR: '',
    nameEN: '',
    isActive: '',
    notes: '',

  };
  selectedEntryTypeId: number;
  openAddModal(content: any, journalEntryTypeModel: JournalEntryTypeModel = null) {
    this.loadSelectors();
    this.isUpdate = false;
    this.buildForm();
    if (journalEntryTypeModel)
      this.fillEditForm(journalEntryTypeModel);

    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });
  }
  loadSelectors() {

  }
  buildForm() {
    this.formGroup = this.form.group({
      journalTypeId: [null],
      code: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      isActive: [true, [Validators.required]],
      notes: [null],

    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });

  }

  saveRecord() {
    if (!this.validateForm()) {
      return;
    }
    this.journalEntryTypeModel = this.formGroup.value;
    if (this.journalEntryTypeModel?.journalTypeId)
      this.editNewEntryType();
    else
      this.addNewEntryType();
  }

  addNewEntryType() {

    this.showAddLoader = true;
    this.GeneralAccountsService
      .CreateNewJournalEntryType(this.journalEntryTypeModel).subscribe(data => {
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

  editNewEntryType() {


    this.showAddLoader = true;
    this.GeneralAccountsService
      .EditJournalEntryType(this.journalEntryTypeModel.journalTypeId, this.journalEntryTypeModel).subscribe(data => {

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

  fillEditForm(journalEntryTypeModel: JournalEntryTypeModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      journalTypeId: journalEntryTypeModel.journalTypeId,
      code: journalEntryTypeModel.code,
      nameAR: journalEntryTypeModel.nameAR,
      nameEN: journalEntryTypeModel.nameAR,
      isActive: journalEntryTypeModel.isActive,

    });
  }
  openDeleteModal(content: any, id: number) {
    this.selectedEntryTypeId = id;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  deleteEntryType() {
    this.showAddLoader = true;
    this.GeneralAccountsService.DeleteJournalEntryType(this.selectedEntryTypeId).subscribe(data => {

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
