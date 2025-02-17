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
import { JournalEntryAccount, JournalEntryModel } from '../../models/GeneralAccounts/JurnalEntryModel';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { ActionsResponseModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';
import { JournalTemplateDetails } from '../../models/GeneralAccounts/JournalTemplateDetailsModel';

@Component({
  selector: 'app-create-journal-entry',
  templateUrl: './create-journal-entry.component.html',
  styleUrls: ['./create-journal-entry.component.css']
})
export class CreateJournalEntryComponent implements OnInit {
  entryModel: JournalEntryModel = {} as JournalEntryModel;


  showLoader: boolean = false;
  showAddLoader: boolean = false;
  entryAccounts: JournalEntryAccount[] = [];
  accountsSelector: FormDropdownModel[] = [];
  costCenterSelector: FormDropdownModel[] = [];
  currencyTypesSelector: FormDropdownModel[] = [];
  journalEntryTypesSelector: FormDropdownModel[] = [];
  journalTemplatesSelector: FormDropdownModel[] = [];

  journalTemplates: any[] = [];

  formData: FormData = new FormData();
  public formGroup: FormGroup;
  isUpdate: boolean = false;
  difference = 0;

  constructor(private modalService: NgbModal,
    private sharedService: SharedService,
    private toaster: ToastrService,
    private acRoute: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private generalService: GeneralAccountService,
    private pdfExportService: PDFExportService,
    private calendar: NgbCalendar,
    private form: FormBuilder,
    private _FormService: FormService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.EntryId) {
        this.entryModel = params.EntryId;
        this.getEntryDetailsById(params.EntryId);
        // this.getReceiveOrderProducts();
      }
    })


    this.initNewForm();

    this.loadSelectors();
  }

  getEntryDetailsById(entryId) {
    this.showLoader = true;
    this.generalService.GetJournalEntryDetailsById(entryId).subscribe(data => {
      if (data) {
        this.entryModel = data;
        this.initNewForm(this.entryModel);
        // this.entryModel.entryNumber = data?.entryNumber;
        // this.entryModel.docNumber = data?.docNumber;
        // this.entryModel.description = data?.description;
        // this.entryModel.entryDate = data?.entryDate;
        // this.entryModel.entryNumber = data?.entryNumber;
        // this.entryModel.journalTypeId = data?.journalTypeId;
        // this.entryModel.notes = data?.notes;
        // this.entryModel.journalEntryAccounts = data?.journalEntryAccounts;

        // this.entryAccounts = data?.journalEntryAccounts;
      }
      //this.createEntryModel(data);
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

    this.generalService.GetSavedJournalTemplates().subscribe(data => {
      this.journalTemplates = data;
      this.journalTemplatesSelector = this.journalTemplates.map(x => {
        return {
          value: x.journalTemplateId,
          name: x.nameAR,

        }
      });
    });
    this.currencyTypesSelector = this.paymentService.CurrencyTypesSelector;
    this.journalEntryTypesSelector = this.paymentService.JournalEntryTypesSelector;

  }

  journalTemplatesChanged(journalTemplateId) {
    this.getAccountsByTemplateId(journalTemplateId);
  }
  getAccountsByTemplateId(journalTemplateId) {
    this.entryAccounts = [];
    this.generalService.GetAccountsByTemplateId(journalTemplateId).subscribe((data:JournalTemplateDetails[]) => {
      this.entryAccounts = data.map(entryAccount => {
        return {
          accountId: entryAccount.accountId,
          debit: 0,
          credit: 0,
          costCenterId: entryAccount.costCenterId,
          notes: entryAccount.description,
        }
      });
      this.inputFocus();
    });
  }
  initNewForm(entryModel: JournalEntryAccount = null) {
    this.entryAccounts = [];
    this.isUpdate = false;
    this.buildForm();
    if (entryModel)
      this.fillEditForm(entryModel);
  }

  buildForm() {
    
    this.formGroup = this.form.group({
      entryId: [null],
      entryNumber: [null],
      docNumber: [null, [Validators.required]],
      entryDate: [null, [Validators.required]],
      journalTypeId: [null, [Validators.required]],
      currencyTypeId: [null],
      journalEntryAccounts: [[] as JournalEntryAccount[], [Validators.required, Validators.minLength(1)]],
      description: [null],
      notes: [null],
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
  fillEditForm(entryModel: JournalEntryModel) {
    this.entryAccounts =  entryModel.journalEntryAccounts;
    this.isUpdate = true;

    this.formGroup.patchValue({

      entryId: entryModel.entryId,
      entryNumber: entryModel.entryNumber,
      docNumber: entryModel.docNumber,
      entryDate: this.datePipe.transform(entryModel.entryDate, 'yyyy-MM-dd'),
      journalTypeId: entryModel.journalTypeId,
      currencyTypeId: entryModel.currencyTypeId,
      journalEntryAccounts: entryModel.journalEntryAccounts,
      description: entryModel.description,
      notes: entryModel.notes,
    });
  }

  saveEntry() {
    if (this.entryAccounts?.length === 0 || this.entryAccounts?.every(entry =>!entry.accountId))
      this.toaster.warning('لا يوجد حسابات');

    this.formGroup.patchValue({journalEntryAccounts: this.entryAccounts.filter(entry =>entry.accountId)});
    if (!this.validateForm()) {
      return;
    }
    this.entryModel = this.formGroup.value;

    if (this.isUpdate)
      this.editEntry();
    else
      this.addNewEntry();
  }

  addNewEntry() {
    this.showAddLoader = true;

    this.generalService.SaveNewJournalEntry(this.entryModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        // this.formGroup?.reset();
        //this.initNewForm();
        this.toaster.success(data?.message);
        this.entryModel.entryNumber = data.number;
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

  editEntry() {
    this.showAddLoader = true;
    this.generalService.EditJournalEntry(this.entryModel.entryId, this.entryModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        // this.formGroup?.reset();
        // this.initNewForm();
        this.toaster.success(data?.message);
        // this.getEntryDetailsById();
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
  // validateData(): boolean {
  //   if (!this.DocNumber || !this.EntryDate || !this.journalTypeId) {
  //     this.toaster.warning('Please Fill Fields');
  //     return false;

  //   }
  //   if (this.AccountsListTable.some(x => !x.creditor && !x.debtor)) {
  //     this.toaster.warning('Please Fill Debtor or Creditor filed for each row');
  //     return false;
  //   }
  //   if (this.AccountsListTable.some(x => x.isDisToCostCenter && !x.costCenter)) {
  //     this.toaster.warning('Please Select Cost Center');

  //     return false;
  //   }
  //   if (this.Difference != 0) {
  //     this.toaster.warning('Difference Between Debtor and Creditor Must Equals 0');
  //     return false;
  //   }

  //   return true;

  // }
  public formErrors = {
    entryId: '',
    entryNumber: '',
    docNumber: '',
    entryDate: '',
    journalTypeId: '',
    currencyTypeId: '',
    journalEntryAccounts: '',
    description: '',
    notes: '',
  };

  addField() {
    this.entryAccounts.push(
      {

        accountId: null,
        debit: 0,
        credit: 0,
        costCenterId: null,
        costValue: null,
        costPercent: null,
        currencyId: null,
        accountNumber: null,
        accountName: null,
        notes: '',
      }
    );
  }

  deleteFromList(list: any[], index: number) {
    if (list?.length)
      list.splice(index, 1);
    this.calcDifference();
  }
  calcDifference() {
    let debit = 0;
    let credit = 0;
    this.entryAccounts.forEach(item => {
      debit += item.debit ? Number(item.debit) : 0;
      credit += item.credit ? Number(item.credit) : 0;
    });
    this.difference = debit - credit;
  }
  validateNumbers(key: any): boolean {
    let patt = /^([0-9\+])$/;
    let result = patt.test(key);
    return result;
  }

  inputFocus() {
    // if (this.entryAccounts.length > 0) {
    //   setTimeout(() => {
    //     let inputEls = this.inputs.toArray();
    //     inputEls[0].nativeElement.focus();
    //   }, 1);
    // }
  }



  focusDownAndUp(elementId: any, index: number, type: string) {
    // let inputEls: any;
    // let eventElement = [this.inputs, this.inputs2, this.inputs3];
    // let input = eventElement.find(i => i._results[0].nativeElement.id == elementId);
    // inputEls = input.toArray();
    // if (type == 'down')
    //   index = Math.min(index + 1, this.entryAccounts.length - 1);
    // else
    //   index = Math.max(0, index - 1);
    // inputEls[index].nativeElement.focus();

  }

  focusLeftAndRight(elementId: any, index: number) {
    // let inputEls: any;
    // let eventElement = [this.inputs, this.inputs2, this.inputs3];
    // let input = eventElement.find(i => i._results[0].nativeElement.id == elementId);
    // inputEls = input.toArray();
    // inputEls[index].nativeElement.focus();
  }




}
