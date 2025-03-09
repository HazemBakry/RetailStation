import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ReceiveReceipt } from '../models/GeneralAccounts/ReceiveReceipt';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
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

  GetPaymentOrders_Summary(model: FilterModel) {
    return this.http.post<PagedResponseDTO<ReceiptModel[]>>(this.URL + 'Payment/GetPaymentOrders_Summary', model);
  }

  GetPaymentOrders_Filters(model: FilterModel) {
    return this.http.post<any>(this.URL + 'Payment/GetPaymentOrders_Filters', model);
  }

  SavePaymentOrder(model: ReceiptModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Payment/SavePaymentOrder', model);
  }

  CancelPaymentOrder(OrderId: any) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Payment/CancelPaymentReceipt?OrderId=' + OrderId);
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

  SavePaymentReceipt(model: ReceiptModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Payment/SavePaymentReceipt', model);
  }

  CancelPaymentReceipt(ReceiptId: any) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Payment/CancelPaymentReceipt?ReceiptId=' + ReceiptId);
  }

  GetPaymentOrderDetails(OrderId: number) {
    return this.http.get<ReceiptModel>(this.URL + 'Payment/GetPaymentOrderDetails?OrderId=' + OrderId);
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
