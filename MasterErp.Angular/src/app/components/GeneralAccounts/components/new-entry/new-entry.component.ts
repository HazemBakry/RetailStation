import { AfterViewInit, Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralAccountService } from '../../services/general-account.service';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { JournalEntryAccount, JournalEntryModel } from '../../models/GeneralAccounts/JurnalEntryModel';
import { ErpSelectorWithSearchComponent } from 'src/app/components/Shared/components/selectors/erp-selector-with-search/erp-selector-with-search.component';
import { PDFExportService } from 'src/app/components/Shared/services/pdfexport-service.service';
import { NgbAlertModule, NgbDatepickerModule, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
@Component({
  selector: 'app-new-entry',
  templateUrl: './new-entry.component.html',
  styleUrls: ['./new-entry.component.css'],
})
export class NewEntryComponent implements OnInit {
  @ViewChildren('inputs') inputs;
  @ViewChildren('inputs2') inputs2;
  @ViewChildren('inputs3') inputs3;
  @ViewChild('Selector') Selector: ErpSelectorWithSearchComponent;
  @ViewChild('Selector1') Selector1: ErpSelectorWithSearchComponent;
  AccountsList: any[] = [];
  CostCenterList: any[] = [];
  AccountsListTable: any[] = [];
  EditQuantityList: any[] = [];
  JournalEntryTypes: any[] = [];
  JournalTemplates: any[] = [];
  AccountsByTemplate: any[] = [];
  SelectedAccounts: any[] = [];
  Item: any;
  AccountNumber: string;
  activeTab = 'Account';
  journalTypeId: any;
  CurrencyId: any;
  TemplateId: any;
  Difference = 0;
  EntryNumber: any;
  EntryDate: any;
  DocNumber: any;
  Description: any;
  JournalTypeName = 'نوع القيد';
  CurrencyName = 'العملة';
  entryModel: JournalEntryModel = {} as JournalEntryModel;
  selectedAccountId: number = null;
  costCenterId: number = null;
  showLoader: boolean = false;
  CurrencyType: any[];

  constructor(private modalService: NgbModal,
    private sharedService: SharedService,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private generalService: GeneralAccountService,
    private pdfExportService: PDFExportService,
    private calendar: NgbCalendar
  ) { }

  ngOnInit(): void {
    this.CurrencyType = this.paymentService.CurrencyType;
    this.JournalEntryTypes = this.paymentService.JournalEntryType;
    this.getAccountsSelector();
    this.getCostCenterSelector();
    this.getSavedJournalTemplates();
    //this.getCurrencyList();
    let entryId = this.route.snapshot.queryParamMap.get('EntryId');
    if (entryId)
      this.getEntryDetailsByEntryId(entryId);
  }

  getAccountsSelector() {
    this.sharedService.GetAccountsSelector(false).subscribe(data => {
      this.AccountsList = data;
    });
  }

  getCostCenterSelector() {
    this.sharedService.GetCostCenterSelector(false).subscribe(data => {
      this.CostCenterList = data;
    });
  }

  getSavedJournalTemplates() {
    this.generalService.GetSavedJournalTemplates().subscribe(data => {
      this.JournalTemplates = data;
    });
  }

  getAccountsByTemplateId() {
    this.AccountsListTable = [];
    this.generalService.GetAccountsByTemplateId(this.TemplateId).subscribe(data => {
      this.AccountsByTemplate = data;
      this.AccountsByTemplate.forEach(item => {
        let account = this.AccountsList.find(i => i.accountID == item.accountId);
        if (account) {
          let checked = this.AccountsListTable.find(i => i.accountID == account.accountID);
          if (!checked)
            this.AccountsListTable.push(account);
          account.creditor = '';
          account.debtor = '';
          account.notes = '';
        }
      });
      this.modalService.dismissAll();
      this.InputFocus();
    });
  }

  openAccountModal(content: any) {
    this.AccountNumber = '';
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  getEntryDetailsByEntryId(entryId) {
    this.showLoader = true;
    this.generalService.GetJournalEntryDetailsById(entryId).subscribe(data => {
      if (data) {
        this.entryModel.entryNumber = data?.entryNumber;
        this.entryModel.docNumber = data?.docNumber;
        this.entryModel.description = data?.description;
        this.entryModel.entryDate = data?.entryDate;
        this.entryModel.entryNumber = data?.entryNumber;
        this.entryModel.journalTypeId = data?.journalTypeId;
        this.entryModel.notes = data?.notes;
        this.entryModel.journalEntryAccounts = data?.journalEntryAccounts;

        this.SelectedAccounts = data?.journalEntryAccounts;
      }
      //this.createEntryModel(data);
      this.showLoader = false;
    }, (error) => { this.showLoader = false; }, () => { this.showLoader = false; });
  }

  GetSelectedAccount(item: any) {
    let account = this.AccountsList.find(i => i.id == item);
    if (account)
    {
      this.SelectedAccounts.push({
        accountID: account.id,
        accountNumber: account.code,
        accountName: account.name
      });
    }
  }

  ClearSelectedAccount(index: number) {
    this.entryModel.journalEntryAccounts.splice(index, 1);
  }

  GetSelectedTemplate(item: any) {
    this.TemplateId = item.journalTemplateId;
  }

  GetSelectedJurnalTypes(item: any) {
    this.journalTypeId = item.journalTypeId;
  }

  GetSelectedCurrency(item: any) {
    this.CurrencyId = item.currencyId;
  }

  GetSelectedCostCenter(obj: any, item: any) {
    item.costCenter = obj.costCenterId;
  }

  addSelectedAccountsToEntry() {
    if (!this.TemplateId && this.entryModel.journalEntryAccounts.length == 0) {
      this.toaster.warning('Please Select Account Or Template');
      return;
    }
    debugger
    if (this.activeTab == 'Account') {
      // this.SelectedAccounts.forEach((account, index) => {
      //   //debugger
      //   // let checked = this.AccountsListTable.find(i => i.accountId == account.accountId);
      //   // if (!checked)
      //   //this.entryModel.journalEntryAccounts.push(account);
      //   //account.credit = null;
      //   //account.debit = null;
      //   //account.notes = '';
      // });
      this.InputFocus();
      this.modalService.dismissAll();
    } else {
      this.getAccountsByTemplateId();
    }

  }

  InputFocus() {
    if (this.AccountsListTable.length > 0) {
      setTimeout(() => {
        let inputEls = this.inputs.toArray();
        inputEls[0].nativeElement.focus();
      }, 1);
    }
  }

  RemoveAccount(index: number) {
    this.AccountsListTable.splice(index, 1);
  }

  FocusDownAndUp(elementId: any, index: number, type: string) {
    let inputEls: any;
    let eventElement = [this.inputs, this.inputs2, this.inputs3];
    let input = eventElement.find(i => i._results[0].nativeElement.id == elementId);
    inputEls = input.toArray();
    if (type == 'down')
      index = Math.min(index + 1, this.AccountsListTable.length - 1);
    else
      index = Math.max(0, index - 1);
    inputEls[index].nativeElement.focus();

  }

  FocusLeftAndRight(elementId: any, index: number) {
    let inputEls: any;
    let eventElement = [this.inputs, this.inputs2, this.inputs3];
    let input = eventElement.find(i => i._results[0].nativeElement.id == elementId);
    inputEls = input.toArray();
    inputEls[index].nativeElement.focus();
  }

  ItemTypeChange(name) {
    if (name == 'Account')
      this.activeTab = 'Account';
    else
      this.activeTab = 'Template';
  }

  CalcDifference() {
    let debit = 0;
    let credit = 0;
    this.SelectedAccounts.forEach(item => {
      debit += item.debit ? Number(item.debit) : 0;
      credit += item.credit ? Number(item.credit) : 0;
    });
    this.Difference = debit - credit;
  }

  NumbersOnly(key: any): boolean {
    let patt = /^([0-9\+])$/;
    let result = patt.test(key);
    return result;
  }

  SaveNewAccount() {
    if (this.AccountsListTable.length == 0) {
      this.toaster.warning('Please Enter Accounts First');
      return;
    }
    if (!this.validateData()) {

      return;
    }
    //let month = ("0" + ((new Date(this.EntryDate)).getMonth() + 1)).slice(-2);
    //let year = (new Date(this.EntryDate)).getFullYear();

    // let journalEntryAccounts = this.AccountsListTable.map<JournalEntryAccount>(item => {
    //   {
    //     return {
    //       accountID: item.accountID,
    //       accountName: item.nameEN,
    //       notes: item.notes,
    //       accountNumber: item.accountNumber,
    //       costCenterId: item.costCenter ? item.costCenter : 0,
    //       costPercent: 0,
    //       costValue: 0,
    //       currencyID: 0,
    //       credit: item.creditor ? Number(item.creditor) : 0,
    //       debit: item.debtor ? Number(item.debtor) : 0,
    //       description: ''
    //     }
    //   }
    // })

    let model: JournalEntryModel = {} as JournalEntryModel;

    model.docNumber = this.DocNumber;
    model.entryNumber = this.EntryNumber;
    model.entryDate = this.EntryDate;
    // model.descirption = '';
    model.description = this.Description;
    //model.month = Number(month);
    //model.year = year;
    model.journalTypeId = this.journalTypeId;
    model.journalEntryAccounts = this.SelectedAccounts;

    this.generalService.SaveNewJournalEntry(model).subscribe(data => {
      if (data?.status) {
        // this.ClearAllFields();
        this.EntryNumber = data.number;
        this.entryModel = model;
        this.entryModel.entryNumber = this.EntryNumber;
        this.toaster.success(data?.message);
      } else {
        this.toaster.error(data?.message);
      }
      // if (data.item1) {
      //   this.ClearAllFields();
      //   this.toaster.success(data.item2);
      // } else {
      //   this.toaster.error(data.item2);
      // }
    });
  }
  validateData(): boolean {
    if (!this.DocNumber || !this.EntryDate || !this.journalTypeId) {
      this.toaster.warning('Please Fill Fields');
      return false;

    }
    if (this.AccountsListTable.some(x => !x.creditor && !x.debtor)) {
      this.toaster.warning('Please Fill Debtor or Creditor filed for each row');
      return false;
    }
    if (this.AccountsListTable.some(x => x.isDisToCostCenter && !x.costCenter)) {
      this.toaster.warning('Please Select Cost Center');

      return false;
    }
    if (this.Difference != 0) {
      this.toaster.warning('Difference Between Debtor and Creditor Must Equals 0');
      return false;
    }

    return true;

  }
  ClearAllFields() {
    this.TemplateId = '';
    this.AccountsListTable = [];
    this.Difference = 0;
    this.activeTab = 'Account';
    this.Selector.ResetSelectorName('نوع القيد');
    this.Selector1.ResetSelectorName('العملة');
    this.entryModel = {};
  }

  Print() {
    this.pdfExportService.generatePDF(this.entryModel, 'print');
  }

  model: NgbDateStruct;
  model_2: NgbDateStruct;
  today = this.calendar.getToday();

}
