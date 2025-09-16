
using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Finance.Purchases;
using RetailStation.Entities.DTOs.Website;
using System.Collections.Generic;

namespace RetailStation.Interface.Website
{
    public interface IPaymentReceiptService
    {

        // ----------------- Payment Receipts -----------------//
        List<PaymentReceiptModel> GetPaymentReceipts_Data(SearchFilterModel model, int? PaymentReceiptId=null);
        List<FilterModel> GetPaymentReceipts_Filters(SearchFilterModel model);
        PaymentReceiptModel GetPaymentReceiptDetailsById(int PaymentReceiptId);

        ActionsResponseModel SaveNewPaymentReceipt(PaymentReceiptModel Model);
        ActionsResponseModel EditPaymentReceipt(int PaymentReceiptId , PaymentReceiptModel Model);
        ActionsResponseModel CancelPaymentReceipt(int ReceiptId);
        List<SupplierStatementModel> GetSupplierStatementData(int SupplierId, SearchFilterModel model);

    }
}
