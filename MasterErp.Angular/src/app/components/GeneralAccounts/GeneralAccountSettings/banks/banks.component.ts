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
import { GeneralAccountService } from '../../services/general-account.service';
import { GeneralAccountSettingsService } from '../../services/general-account-settings.service';

@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styleUrls: ['./banks.component.css']
})
export class BanksComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'البنوك'];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  pagedResponse: PagedResponseDTO<any[]> = {
    currentPage: 1,
    pageSize: 10,
    results: [],
    filterList: [],
    searchText: ''
  }
  bankModel: any = {} as any;

  constructor(private toaster: ToastrService,
    private generalService: GeneralAccountSettingsService,
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
    this.generalService.GetBanksData(this.pagedResponse).subscribe((data: any) => {
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
    bankId: '',
    //code: '',
    nameAR: '',
    nameEN: '',
    address: '',
    isActive: ''
  };

  //citySelectorData: GeneralSelectorModel[] = [];
  selectedBankId: number;
  openAddModal(content: any, BankModel: any = null) {
    //this.loadSelectors();
    this.isUpdate = false;
    this.buildForm();
    if (BankModel)
      this.fillEditForm(BankModel);

    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });
  }

  buildForm() {
    this.formGroup = this.form.group({
      bankId: [null],
      // code: [null],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      address: [null],
      isActive: true,
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  saveRecord() {
    if (!this.validateForm()) {
      return;
    }
    this.bankModel = this.formGroup.value;
    if (this.bankModel?.bankId)
      this.editBankData();
    else
      this.addNewBank();
  }

  addNewBank() {
    this.showAddLoader = true;
    this.generalService.CreateNewBank(this.bankModel).subscribe(data => {
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

  editBankData() {
    this.showAddLoader = true;
    this.generalService.EditBank(this.bankModel.bankId, this.bankModel).subscribe(data => {
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

  fillEditForm(BankModel: any) {
    this.isUpdate = true;
    this.formGroup.patchValue({
      bankId: BankModel.bankId,
      //code: BankModel.code,
      nameAR: BankModel.nameAR,
      nameEN: BankModel.nameEN,
      isActive: BankModel.isActive
    });
  }
  openDeleteModal(content: any, id: number) {
    this.selectedBankId = id;
    this.modalService.open(content, { centered: true, size: 'sm' });
  }

  deleteBank() {
    this.showAddLoader = true;
    this.generalService.DeleteBank(this.selectedBankId).subscribe(data => {
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
