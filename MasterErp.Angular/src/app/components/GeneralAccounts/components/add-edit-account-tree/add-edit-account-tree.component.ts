import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AccountTreeModel } from '../../models/GeneralAccounts/AccountTree';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { GeneralAccountService } from '../../services/general-account.service';
import { CreateModifyReturnsModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';
import { ErpSelectorWithSearchComponent } from 'src/app/components/Shared/components/selectors/erp-selector-with-search/erp-selector-with-search.component';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { DatePipe } from '@angular/common';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';

@Component({
  selector: 'app-add-edit-account-tree',
  templateUrl: './add-edit-account-tree.component.html',
  styleUrls: ['./add-edit-account-tree.component.css']
})
export class AddEditAccountTreeComponent implements OnInit, OnChanges {
  @Input() isUpdate: boolean = false;
  @Input() accountModel: AccountTreeModel = {} as AccountTreeModel;

  @Output() dataUpdated = new EventEmitter<boolean>();

  showLoader: boolean = false;
  parentAccountsList: any[] = [];
  accountTypes: any[] = [];
  currencyType: any[] = [{ currencyId: 1, nameAR: 'جنيه' }, { currencyId: 1, nameAR: 'ريال' }]
  accountTypesSelectorData: FormDropdownModel[] = [];
  parentAccountsSelectorData: FormDropdownModel[] = [];
  currencyTypesSelectorData: FormDropdownModel[] = [];
  selectedAccountId: number = null;
  public formGroup: FormGroup;

  public formErrors = {
    accountId: '',
    accountNumber: '',
    parentAccountId: '',
    accountTypeId: '',
    currencyTypeId: '',
    preCredit: '',
    preDebit: '',
    nameAR: '',
    nameEN: '',
    descriptionMethod: '',
    isDisToCostCenter: '',
    isActive: '',
    notes: '',

  };
  constructor(private modalService: NgbModal, private sharedService: SharedService,
    private _GeneralAccountService: GeneralAccountService, private toaster: ToastrService, private form: FormBuilder, private _FormService: FormService, private datePipe: DatePipe,) { }



  ngOnInit(): void {
    this.initNewForm();
    this.loadSelectors();

  }

  ngOnChanges(changes): void {
    if (changes && !changes.accountModel.firstChange) {
      if (this.accountModel && this.accountModel != null) {
        this.initNewForm(this.accountModel);
      }
    }
  }



  initNewForm(accountModel: AccountTreeModel = null) {

    this.isUpdate = false;
    this.buildForm();
    if (accountModel)
      this.fillEditForm(accountModel);
    else
      this.accountModel = {} as  AccountTreeModel;

    // this.formGroup.patchValue({employeeId:this.selectedAccountId});

  }
  buildForm() {
    this.formGroup = this.form.group({
      accountId: [null],
      accountNumber: [null, [Validators.required]],
      parentAccountId: [null],
      accountTypeId: [null, [Validators.required]],
      currencyTypeId: [null],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      isDisToCostCenter: [false, [Validators.required]],
      isActive: [true, [Validators.required]],
      notes: [null],

    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
  }

  saveAccount() {
    if (!this.validateForm()) {
      return;
    }
    this.accountModel = this.formGroup.value;

    if (this.accountModel?.accountId)
      this.editAccount();
    else
      this.addNewAccount();
  }

  addNewAccount() {

    this.showLoader = true;
    this._GeneralAccountService
      .AddNewAccount(this.accountModel).subscribe(data => {
        if (data?.isSuccess) {
          this.formGroup?.reset();
          // this.offcanvasService?.dismiss();
          // this.getAccounts();
          this.toaster.success(data?.message);
          this.dataUpdated.emit(true);
        }
        else {
          this.toaster.error(data?.message);
        }
        this.showLoader = false;
      }, err => {
        this.showLoader = false;
      }, () => {
        this.showLoader = false;
      });



  }

  editAccount() {

    this.showLoader = true;
    this._GeneralAccountService
      .EditAccountTree(this.accountModel.accountId, this.accountModel).subscribe(data => {

      if (data?.isSuccess) {
        // this.formGroup?.reset();
        this.initNewForm(); 
        this.toaster.success(data?.message);
        this.dataUpdated.emit(true);
      }
      else {
        this.toaster.error(data?.message);
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
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


  fillEditForm(accountModel: AccountTreeModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      accountId: accountModel.accountId,
      accountNumber: accountModel.accountNumber,
      accountTypeId: accountModel.accountTypeId,
      parentAccountId: accountModel.parentAccountId,
      currencyTypeId: accountModel.currencyTypeId,
      nameAR: accountModel.nameAR,
      nameEN: accountModel.nameEN,
      isDisToCostCenter: accountModel.isDisToCostCenter,
      isActive: accountModel.isActive

    });
  }
  loadSelectors() {
    this.sharedService.GetAccountTypesSelector().subscribe(data => {
      this.accountTypesSelectorData = data;
    });
    this.sharedService.GetCurrencySelector().subscribe(data => {
      this.currencyTypesSelectorData = data;
    });
    this.sharedService.GetAccountsSelector(true).subscribe(data => {
      this.parentAccountsSelectorData = data;
    })
  }






  getSelectedParentAccount(account: AccountTreeModel) {
    this.accountModel.parentAccountId = account.accountId;
    this.accountModel.accountLevel = account.accountLevel + 1;
  }
}
