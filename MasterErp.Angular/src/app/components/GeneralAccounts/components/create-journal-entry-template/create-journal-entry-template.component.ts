import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PDFExportService } from 'src/app/components/Shared/services/pdfexport-service.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { GeneralAccountService } from '../../services/general-account.service';
import { PaymentService } from '../../services/payment.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';
import { JournalTemplateDetailsModel, JournalTemplateModel } from '../../models/GeneralAccounts/JournalTemplateDetailsModel';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';

@Component({
  selector: 'app-create-journal-entry-template',
  templateUrl: './create-journal-entry-template.component.html',
  styleUrls: ['./create-journal-entry-template.component.css']
})
export class CreateJournalEntryTemplateComponent implements OnInit {
  entryTemplateModel: JournalTemplateModel = {} as JournalTemplateModel;

  titleList = ['الحسابات العامة', 'قوالب قيد اليومية'];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  entryTemplateAccounts: JournalTemplateDetailsModel[] = [];
  accountsSelector: GeneralSelectorModel[] = [];
  costCenterSelector: GeneralSelectorModel[] = [];
  currencyTypesSelector: GeneralSelectorModel[] = [];
  journalEntryTypesSelector: GeneralSelectorModel[] = [];

  journalTemplates: any[] = [];

  formData: FormData = new FormData();
  public formGroup: FormGroup;
  isUpdate: boolean = false;
  difference = 0;
  totalDebit = 0;
  totalCredit = 0;
  public formErrors = {
    journalTemplateId: '',
    nameAR: '',
    nameEN: '',
    docNumber: '',
    entryDate: '',
    journalTypeId: '',
    currencyTypeId: '',
    accounts: '',
    description: '',
  };

  constructor(private modalService: NgbModal,
    private sharedService: SharedService,
    private toaster: ToastrService,
    private acRoute: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private generalService: GeneralAccountService,
    private form: FormBuilder,
    private _FormService: FormService,
    private lookupService: LookupService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.JournalTemplateId) {
        this.getJournalTemplateDetailsById(params.JournalTemplateId);
      }
    })


    this.initNewForm();

    this.loadSelectors();
  }

  getJournalTemplateDetailsById(journalTemplateId) {
    this.showLoader = true;
    this.generalService.GetJournalTemplateDetailsById(journalTemplateId).subscribe(data => {
      if (data) {
        this.entryTemplateModel = data;
        this.initNewForm(this.entryTemplateModel);
      }
      this.showLoader = false;
    }, (error) => {
      this.showLoader = false;

    }, () => {
      this.showLoader = false;
    });
  }
  loadSelectors() {
    this.sharedService.GetAccountsSelector(false).subscribe(data => {
      this.accountsSelector = data;
    });

    this.sharedService.GetCostCenterSelector(false).subscribe(data => {
      this.costCenterSelector = data;
    });

    this.lookupService.GetJournalEntryTypes().subscribe(data => {
      this.journalEntryTypesSelector = data;
    });
    this.currencyTypesSelector = this.paymentService.CurrencyTypesSelector;
  }


  getAccountsByTemplateId(journalTemplateId) {
    this.entryTemplateAccounts = [];
    if (!journalTemplateId)
      return;
    this.generalService.GetJournalTemplateDetailsById(journalTemplateId).subscribe((data: JournalTemplateModel) => {
      if (data) {
        this.entryTemplateAccounts = data.accounts?.map(entryAccount => {
          return {
            accountId: entryAccount.accountId,
            debit: entryAccount.debit,
            credit: entryAccount.credit,
            costCenterId: entryAccount.costCenterId,
            description: entryAccount.description,
          }
        });
      }
    });
  }
  initNewForm(entryModel: JournalTemplateModel = null) {
    this.entryTemplateAccounts = [];
    this.isUpdate = false;
    this.buildForm();
    if (entryModel)
      this.fillEditForm(entryModel);
    this.calcDifference();
  }

  buildForm() {

    this.formGroup = this.form.group({
      journalTemplateId: [null],
      docNumber: [null],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      journalTypeId: [null],
      currencyTypeId: [null],
      accounts: [[] as JournalTemplateDetailsModel[], [Validators.required, Validators.minLength(1)]],
      description: [null],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

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
  fillEditForm(entryModel: JournalTemplateModel) {
    this.entryTemplateAccounts = entryModel.accounts;
    this.isUpdate = true;

    this.formGroup.patchValue({
      journalTemplateId: entryModel.journalTemplateId,
      docNumber: entryModel.docNumber,
      nameAR: entryModel.nameAR,
      nameEN: entryModel.nameEN,
      journalTypeId: entryModel.journalTypeId,
      currencyTypeId: entryModel.currencyTypeId,
      accounts: entryModel.accounts,
      description: entryModel.description,
    });
  }

  saveEntryTemplate() {

    if (!this.validateAccounts())
      return;
    this.formGroup.patchValue({ accounts: this.entryTemplateAccounts.filter(entry => entry.accountId) });
    if (!this.validateForm()) {
      return;
    }
    this.entryTemplateModel = this.formGroup.value;

    if (this.isUpdate)
      this.editEntryTemplate();
    else
      this.addNewEntryTemplate();
  }

  addNewEntryTemplate() {
    this.showAddLoader = true;

    this.generalService.SaveNewJournalEntryTemplate(this.entryTemplateModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        // this.formGroup?.reset();
        //this.initNewForm();
        this.toaster.success(data?.message);
        this.entryTemplateModel.journalTemplateId = data.id;
        this.initNewForm(this.entryTemplateModel)
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

  editEntryTemplate() {
    this.showAddLoader = true;
    this.generalService.EditJournalEntryTemplate(this.entryTemplateModel.journalTemplateId, this.entryTemplateModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        // this.formGroup?.reset();
        // this.initNewForm();
        this.toaster.success(data?.message);
        // this.getJournalTemplateDetailsById();
        this.entryTemplateModel.journalTemplateId = data.id;

        this.initNewForm(this.entryTemplateModel)
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
  validateAccounts(): boolean {
    if (this.entryTemplateAccounts?.length === 0 || this.entryTemplateAccounts?.every(entry => !entry.accountId)) {
      this.toaster.warning('لا يوجد حسابات');
      return false;
    }
    return true;
  }
  addField() {
    this.entryTemplateAccounts.push(
      {
        accountId: null,
        debit: 0,
        credit: 0,
        costCenterId: null,
        description: '',
      }
    );
  }

  deleteFromList(list: any[], index: number) {
    if (list?.length)
      list.splice(index, 1);
    this.calcDifference();
  }
  deleteAllAccounts() { this.entryTemplateAccounts = [];this.calcDifference(); }
  calcDifference() {
    let debit = 0;
    let credit = 0;
    this.entryTemplateAccounts.forEach(item => {
      debit += item.debit ? Number(item.debit) : 0;
      credit += item.credit ? Number(item.credit) : 0;
    });
    this.totalDebit = debit;
    this.totalCredit = credit;
    this.difference = debit - credit;
  }
  validateNumbers(key: any): boolean {
    let patt = /^([0-9\+])$/;
    let result = patt.test(key);
    return result;
  }
}
