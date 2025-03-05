using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
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
        List<ReceiptModel> GetPaymentOrders_Summary(FilterModel model);
        DataTable GetPaymentOrders_Filters(FilterModel model);
        ActionsResponseModel SavePaymentOrder(PaymentOrder Model);
        ActionsResponseModel CancelPaymentOrder(int ReceiptId);
        PaymentOrder GetPaymentOrderDetails(int OrderId);
        List<SelectorDataModel> GetPaymentOrdersSelector();

        // ----------------- Payment Receipts -----------------//
        List<ReceiptModel> GetPaymentReceipts_Summary(FilterModel model);
        DataTable GetPaymentReceipts_Filters(FilterModel model);
        ActionsResponseModel SavePaymentReceipt(ReceiptModel Model);
        ActionsResponseModel CancelPaymentReceipt(int ReceiptId);

        // ----------------- Receive Receipts -----------------//
        List<ReceiptModel> GetReceiveReceipts_Summary(FilterModel model);
        DataTable GetReceiveReceipts_Filters(FilterModel model);
        ActionsResponseModel SaveReceiveReceipt(ReceiptModel Model);
        ActionsResponseModel CancelReceiveReceipt(int ReceiptId);

    }
}
