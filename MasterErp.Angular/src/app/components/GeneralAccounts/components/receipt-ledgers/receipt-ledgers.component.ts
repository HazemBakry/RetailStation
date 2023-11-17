import { Component, OnInit } from '@angular/core';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ToastrService } from 'ngx-toastr';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { GeneralAccountService } from '../../services/general-account.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ReceiptLedgerModel } from '../../models/ReceiptLedgerModel';
import { CreateModifyReturnsModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-receipt-ledgers',
  templateUrl: './receipt-ledgers.component.html',
  styleUrls: ['./receipt-ledgers.component.css']
})
export class ReceiptLedgersComponent implements OnInit {
  paymentTypeList:any[]=[];
  receiptLedgerTypeList:any[]=[];
  financialPeriodsList:any[]=[];

  showLoader: boolean;
  TotalCount: any;
  TotalPages: any;
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25
  };
  pagedResponse:PagedResponseDTO<any[]>={
    currentPage:1,
    pageSize:25,
    results:[],
    filterList:[]
  }
  receiptLedgerModel: ReceiptLedgerModel =
  {} as ReceiptLedgerModel;

  constructor(private GeneralAccountsService: GeneralAccountService, private toaster: ToastrService,
    private sharedService: SharedService,
    private modalService: NgbModal,
    private paymentService:PaymentService
    ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader=true;
    this.GeneralAccountsService.GetReceiptLedgersData(this.FilterModel).subscribe((data:any)=> {
      this.pagedResponse.results=data.results;
      this.pagedResponse.totalCount=data.totalCount;
      this.pagedResponse.currentPage=data.currentPage;
      this.pagedResponse.pageSize=data.pageSize;
      this.pagedResponse.totalPages=data.totalPages;
      // this.TotalCount = data && data.length > 0 && (data[0].matchCount != null || data[0].matchCount != undefined) ? data[0].matchCount : 0;
      this.showLoader=false;
    },(err)=>{
      this.showLoader=false;
    },()=>{
      this.showLoader=false;
    })
  }

  pageChanged(obj: any) {
    this.FilterModel.currentPage = obj.page;
    this.loadData();
  }

  CreateNewReceiptLedger() {
    if (!this.validateFields()) {
      return;
    }
    this.GeneralAccountsService
      .CreateNewReceiptLedger(this.receiptLedgerModel)
      .subscribe((data: CreateModifyReturnsModel) => {
        if (data?.status) {
          this.ClearAllFields();
          this.toaster.success(data?.message);
        } else {
          this.toaster.error(data?.message);
        }
        this.modalService.dismissAll();
        this.loadData();
      });
  }

  GetReceiptLedgerTypes()
  {
    this.sharedService.GetReceiptLedgerTypes().subscribe(data=>{
      this.receiptLedgerTypeList=data;
    });
  }
  GetFinancialPeriods()
  {
    this.sharedService.GetFinancialPeriods().subscribe(data=>{
      this.financialPeriodsList=data;
    })

  }
  GetSelectedFinancialPeriod(type)
  {
    this.receiptLedgerModel.periodId=type.financialPeriodId;
  }
  GetSelectedPaymentType(type)
  {
    this.receiptLedgerModel.operationTypeId=type.id;
  }
  GetSelectedReceiptLedgerType(type)
  {
    this.receiptLedgerModel.receiptLedgerTypeId=type.receiptLedgerTypeId;
  }
  validateFields(): boolean {
    let model: ReceiptLedgerModel = this.receiptLedgerModel;

    if (

      !model.startReceiptNumber ||
      !model.periodId||
      !model.receiptLedgerTypeId||
      !model.operationTypeId||
      !model.code||
      !model.nameEN||
      !model.nameAR
      
    ) {
      this.toaster.warning('يرجي ملئ جميع الخانات');
      return false;
    }
    return true;
  }
  ClearAllFields() {
    this.receiptLedgerModel = {} as ReceiptLedgerModel;

  }
  openModal(content: any) {
    this.paymentTypeList=this.paymentService.paymentTypeList;
    this.GetReceiptLedgerTypes();
    this.GetFinancialPeriods();
    this.ClearAllFields();
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  getStatusColor(status: boolean) {
    if (status == true)
      return "locked";
    else
      return "open";
  }

}
