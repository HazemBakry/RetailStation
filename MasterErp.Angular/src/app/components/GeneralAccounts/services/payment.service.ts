import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ReceiveReceipt } from '../models/GeneralAccounts/ReceiveReceipt';
import { FilterItem, FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { PaymentOperationType } from '../../Shared/Enums/GeneralAccountsEnums';
import { FormDropdownModel } from '../../Shared/components/drop-down-form-control/drop-down-form-control.component';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { PagedResponseDTO } from '../../Shared/models/PagedResponseDTO';
import { ReceiptModel } from '../models/GeneralAccounts/ReceiptModel';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  agencyTypeList: any[] = [
    // {
    //   id:1,
    //   nameAR:'عميل',
    //   nameEN:'Customer'
    // },
    {
      value: 1,
      name: 'حساب'
    },
    {
      value: 2,
      name: 'مورد'
    },
    {
      value: 3,
      name: 'عميل'
    },
    {
      value: 4,
      name: 'موظف'
    }
  ]

  paymentTypeList: any[] = [
    {
      value: PaymentOperationType.Cash,
      name: 'نقدي'
    },
    {
      value: PaymentOperationType.Cheque,
      name: 'شيكات'
    }
  ]

  CurrencyType = [
    {
      currencyId: 1,
      nameAR: 'ريال'
    },
    {
      currencyId: 2,
      nameAR: 'جنيه'
    }
  ];
  CurrencyTypesSelector: FormDropdownModel[] = [
    {
      value: 1,
      name: 'ريال'
    },
    {
      value: 2,
      name: 'جنيه'
    }
  ]

  JournalEntryType = [
    {
      journalTypeId: 1,
      nameAR: 'تسوية'
    },
    {
      journalTypeId: 4,
      nameAR: 'اقفال'
    },
    {
      journalTypeId: 5,
      nameAR: 'قيد افتتاحى'
    }
  ]

  URL = environment.apiURL;
  constructor(private http: HttpClient) { }

  //----------------------------------- Payment Order ------------------------------------------//

  GetPaymentOrders_Summary(model: PagedResponseDTO<ReceiptModel[]>) {
    return this.http.post<PagedResponseDTO<ReceiptModel[]>>(this.URL + 'Payment/GetPaymentOrders_Summary', model);
  }


  GetPaymentOrders_Filters(model: PagedResponseDTO<ReceiptModel[]>) {
    return this.http.post<FilterItem[]>(this.URL + 'Payment/GetPaymentOrders_Filters', model);
  }
  GetPaymentOrderDetailsById(paymentOrderId: number) {
    return this.http.get<ReceiptModel>(this.URL + `Payment/GetPaymentOrderDetailsById?PaymentOrderId=${paymentOrderId}`);
  }
  AddNewPaymentOrder(model: ReceiptModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Payment/AddNewPaymentOrder', model);
  }
  EditPaymentOrder( paymentOrderId:number,model: ReceiptModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Payment/EditPaymentOrder?PaymentOrderId=${paymentOrderId}`, model);
  }

  CancelPaymentOrder(OrderId: any) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Payment/CancelPaymentReceipt?OrderId=' + OrderId);
  }

  CancelPaymentOrderById(OrderId: any) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Payment/CancelOrderOrder?OrderId=' + OrderId);
  }

  GetPaymentOrdersSelector(OrderStatus: any) {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Payment/GetPaymentOrdersSelector?OrderStatus=' + OrderStatus);
  }

  //----------------------------------- Payment Receipt ------------------------------------------//

  GetPaymentReceipts_Summary(model: FilterModel) {
    return this.http.post<PagedResponseDTO<ReceiptModel[]>>(this.URL + 'Payment/GetPaymentReceipts_Summary', model);
  }

  GetPaymentReceipts_Filters(model: FilterModel) {
    return this.http.post<any>(this.URL + 'Payment/GetPaymentReceipts_Filters', model);
  }
  GetPaymentReceiptDetailsById(paymentReceiptId: number) {
    return this.http.get<ReceiptModel>(this.URL + `Payment/GetPaymentReceiptDetailsById?PaymentReceiptId=${paymentReceiptId}`);
  }
  AddNewPaymentReceipt(model: ReceiptModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Payment/AddNewPaymentReceipt', model);
  }
  EditPaymentReceipt( paymentReceiptId:number,model: ReceiptModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Payment/EditPaymentReceipt?PaymentReceiptId=${paymentReceiptId}`, model);
  }
  CancelPaymentReceipt(ReceiptId: any) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Payment/CancelPaymentReceipt?ReceiptId=' + ReceiptId);
  }

  //----------------------------------- Receive Receipt ------------------------------------------//

  GetReceiveReceipts_Summary(model: FilterModel) {
    return this.http.post<PagedResponseDTO<ReceiveReceipt[]>>(this.URL + 'Payment/GetReceiveReceipts_Summary', model);
  }

  GetReceiveReceipts_Filters(model: FilterModel) {
    return this.http.post<any>(this.URL + 'Payment/GetReceiveReceipts_Filters', model);
  }

  SaveReceiveReceipt(model: ReceiveReceipt) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Payment/SaveReceiveReceipt', model);
  }

  CancelReceiveReceipt(ReceiptId: any) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Payment/CancelReceiveReceipt?ReceiptId=' + ReceiptId);
  }
}
