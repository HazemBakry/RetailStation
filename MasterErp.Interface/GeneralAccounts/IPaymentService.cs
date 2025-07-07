using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.DTOs.Purchases;
using MasterErp.Entities.Models.Finance;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.GeneralAccounts
{
    public interface IPaymentService
    {

        // ----------------- Payment Orders -----------------//
        List<ReceiptModel> GetPaymentOrders_Summary(SearchFilterModel model,int? PaymentOrderId = null);
        ReceiptModel GetPaymentOrderDetailsById(int PaymentOrderId);

        DataTable GetPaymentOrders_Filters(SearchFilterModel model);
        ActionsResponseModel AddNewPaymentOrder(ReceiptModel Model);
        ActionsResponseModel EditPaymentOrder(int PaymentOrderId, ReceiptModel Model);
        ActionsResponseModel CancelPaymentOrder(int ReceiptId);
        PaymentOrder GetPaymentOrderDetails(int OrderId);
        List<SelectorDataModel> GetPaymentOrdersSelector(bool OrderStatus);

        // ----------------- Payment Receipts -----------------//
        List<ReceiptModel> GetPaymentReceipts_Summary(SearchFilterModel model, int? PaymentReceiptId=null);
        DataTable GetPaymentReceipts_Filters(SearchFilterModel model);
        ReceiptModel GetPaymentReceiptDetailsById(int PaymentReceiptId);

        ActionsResponseModel AddNewPaymentReceipt(ReceiptModel Model);
        ActionsResponseModel EditPaymentReceipt(int PaymentReceiptId ,ReceiptModel Model);
        ActionsResponseModel CancelPaymentReceipt(int ReceiptId);

        // ----------------- Receive Receipts -----------------//
        List<ReceiptModel> GetReceiveReceipts_Summary(SearchFilterModel model);
        DataTable GetReceiveReceipts_Filters(FilterModel model);
        ActionsResponseModel SaveReceiveReceipt(ReceiptModel Model);
        ActionsResponseModel CancelReceiveReceipt(int ReceiptId);

    }
}
