import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GeneralAccountService } from 'src/app/components/GeneralAccounts/services/general-account.service';

@Component({
  selector: 'app-accounts-report-header',
  templateUrl: './accounts-report-header.component.html',
  styleUrls: ['./accounts-report-header.component.css']
})
export class AccountsReportHeaderComponent implements OnInit {
  @Input() Transfering = false;
  @Input() ShowAllBranch = false;
  @Input() ShowSearchInput = false;
  @Output() SearchAction = new EventEmitter<any>();
  @Output() ExportAction = new EventEmitter<any>();
  @Output() PrintAction = new EventEmitter<any>();
  FromDate: any;
  ToDate: any;
  branchId: any;
  UserModel: any;
  BranchName: string;
  isAdminBranch = false;
  AccountsList: any[] = [];
  SearchText = '';
  Lang = 'en';
  TransferType = 'Transfer Types';
  //SwitcherType = 'Summary';

  constructor(private datepipe: DatePipe,private generalService: GeneralAccountService ) { }

  ngOnInit(): void {
    this.Lang = localStorage.getItem('lang');
    this.UserModel = JSON.parse(localStorage.getItem('UserModel'));
    this.isAdminBranch = this.UserModel?.isAdminBranch;
    this.BranchName = this.Lang == 'en' ? 'Branches' : 'الفروع';
    let endDate = new Date();
    // this.ToDate = this.datepipe.transform(endDate, 'yyyy-MM-dd');
    // this.FromDate = this.datepipe.transform(endDate, 'yyyy-MM-dd');
    this.getBranches();
  }

  getBranches() {
    // this.generalService.GetChildAccountsList().subscribe(data => {
    //   this.Branches = data;
    //   if (!this.isAdminBranch) {
    //     let branch = this.Branches.find(i => i.branchId == this.UserModel?.branchId);
    //     if (branch) {
    //       this.BranchName = branch.nameEn;
    //       this.branchId = branch.branchId;
    //     }
    //   }

    // });
  }

  GetSelectedPaymentType(type)
  {

    // this.paymentReceiptModel.paymentTypeId=type.id;
    // this.loadAccountsByTypeData(type.id);
  }

  onBranchChange(branch: any) {
    this.branchId = branch.branchId;
    this.BranchName = this.Lang == 'en' ? branch.nameEn : branch.nameAr;
  }

  ReportSearchClick() {
    let obj = {
      FromDate: this.datepipe.transform(this.FromDate, 'yyyy-MM-dd'),
      ToDate: this.datepipe.transform(this.ToDate, 'yyyy-MM-dd'),
      BranchId: this.branchId,
      TransferType: this.TransferType,
      SearchText: this.SearchText,
      BranchName : this.BranchName
    }
    this.SearchAction.emit(obj);
  }

  ReportExportClick() {
    let obj = {
      FromDate: this.datepipe.transform(this.FromDate, 'yyyy-MM-dd'),
      ToDate: this.datepipe.transform(this.ToDate, 'yyyy-MM-dd'),
      BranchId: this.branchId,
      TransferType: this.TransferType,
      SearchText: this.SearchText,
    }
    this.ExportAction.emit(obj);
  }

  PrintClick() {
    let obj = {
      FromDate: this.datepipe.transform(this.FromDate, 'yyyy-MM-dd'),
      ToDate: this.datepipe.transform(this.ToDate, 'yyyy-MM-dd'),
      BranchId: this.branchId,
      TransferType: this.TransferType,
      SearchText: this.SearchText,
      BranchName : this.BranchName
    }
    this.PrintAction.emit(obj);
  }

}