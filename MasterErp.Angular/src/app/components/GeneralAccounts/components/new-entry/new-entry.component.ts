import { AfterViewInit, Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralAccountService } from '../../services/general-account.service';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { JournalEntryAccount, JournalEntryModel } from '../../models/GeneralAccounts/JurnalEntryModel';
import { ErpSelectorWithSearchComponent } from 'src/app/components/Shared/components/selectors/erp-selector-with-search/erp-selector-with-search.component';
import { PDFExportService } from 'src/app/components/Shared/services/pdfexport-service.service';
import { NgbAlertModule, NgbDatepickerModule, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
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
  SelectedAccounts: any[] = [];
  JournalEntryTypes: any[] = [];
  JournalTemplates: any[] = [];
  AccountsByTemplate: any[] = [];
  Item: any;
  AccountNumber: string;
  activeTab = 'Account';
  journalTypeId: any;
  CurrencyId: any;
  TemplateId: any;
  Defference = 0;
  EntryNumber: any;
  EntryDate: any;
  DocNumber: any;
  Description: any;
  CurrencyType = [{ currencyId: 1, nameAR: 'جنيه' }, { currencyId: 1, nameAR: 'ريال' }]
  JournalTypeName = 'نوع القيد';
  CurrencyName = 'العملة';
  entryModel: JournalEntryModel = {} as JournalEntryModel;
  selectedAccountId: number = null;


  constructor(private modalService: NgbModal, private sharedService: SharedService, private toaster: ToastrService,
    private generalService: GeneralAccountService,
    private pdfExportService: PDFExportService,
    private calendar: NgbCalendar
  ) { }

  ngOnInit(): void {
    this.GetChildAccountsList();
    this.GetCostCenterTreeData();
    this.GetJournalEntryTypes();
    this.GetSavedJournalTemplates();
    this.GetCurrencyList();
  }

  openAccountModal(content: any) {
    this.AccountNumber = '';
    this.SelectedAccounts = [];
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  GetChildAccountsList() {
    this.generalService.GetChildAccountsList().subscribe(data => {
      this.AccountsList = data;
    });
  }

  GetJournalEntryTypes() {
    this.generalService.GetJournalEntryTypes().subscribe(data => {
      this.JournalEntryTypes = data;
    });
  }

  GetCurrencyList() {
    this.generalService.GetCurrencyList().subscribe(data => {
      this.CurrencyType = data;
    });
  }

  GetSavedJournalTemplates() {
    this.generalService.GetSavedJournalTemplates().subscribe(data => {
      this.JournalTemplates = data;
    });
  }

  GetAccountsByTemplateId() {
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

  GetCostCenterTreeData() {
    this.sharedService.GetCostCenterTreeData().subscribe(data => {
      this.CostCenterList = data;
    });
  }

  GetSelectedAccount(item: any) {
    let account = this.AccountsList.find(i => i.id == item);
    if (account)
      this.SelectedAccounts.push(account);

    //this.Item = item;
    // let checked = this.SelectedAccounts.find(i => i.id == item.id);
    // if (!checked)
    //   this.SelectedAccounts.push(item);
    // else
    //   this.toaster.warning('This Account Alredy Selected');
    
  }

  ClearSelectedAccount(index: number) {
    this.SelectedAccounts.splice(index, 1);
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

  SaveSelectedAccount() {
    debugger
    if (!this.TemplateId && this.SelectedAccounts.length == 0) {
      this.toaster.warning('Please Select Account Or Template');
      return;
    }

    if (this.activeTab == 'Account') {
      this.SelectedAccounts.forEach((account, index) => {
        // let checked = this.AccountsListTable.find(i => i.accountId == account.accountId);
        // if (!checked)
          this.AccountsListTable.push(account);
        account.creditor = '';
        account.debtor = '';
        account.notes = '';
      });
      this.InputFocus();
      this.modalService.dismissAll();
    } else {
      this.GetAccountsByTemplateId();
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

  CalcDefference() {
    let debtor = 0;
    let creditor = 0;
    this.AccountsListTable.forEach(item => {
      debtor += item.debtor ? Number(item.debtor) : 0;
      creditor += item.creditor ? Number(item.creditor) : 0;
    });
    this.Defference = debtor - creditor;
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

    let journalEntryAccounts = this.AccountsListTable.map<JournalEntryAccount>(item => {
      {
        return {
          accountID: item.accountID,
          accountName: item.nameEN,
          notes: item.notes,
          accountNumber: item.accountNumber,
          costCenterId: item.costCenter ? item.costCenter : 0,
          costPercent: 0,
          costValue: 0,
          currencyID: 0,
          credit: item.creditor ? Number(item.creditor) : 0,
          debit: item.debtor ? Number(item.debtor) : 0,
          description: ''
        }
      }
    })

    let model: JournalEntryModel = {} as JournalEntryModel;

    model.docNumber = this.DocNumber;
    model.entryNumber = this.EntryNumber;
    model.entryDate = this.EntryDate;
    // model.descirption = '';
    model.description = this.Description;
    //model.month = Number(month);
    //model.year = year;
    model.journalTypeId = this.journalTypeId;
    model.journalEntryAccounts = journalEntryAccounts;

    this.generalService.SaveNewJouranlEntry(model).subscribe(data => {
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
    if (this.Defference != 0) {
      this.toaster.warning('Difference Between Debtor and Creditor Must Equals 0');
      return false;
    }

    return true;

  }
  ClearAllFields() {
    this.TemplateId = '';
    this.SelectedAccounts = [];
    this.AccountsListTable = [];
    this.EntryNumber = '';
    this.EntryDate = '';
    this.DocNumber = '';
    this.Description = '';
    this.Defference = 0;
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
