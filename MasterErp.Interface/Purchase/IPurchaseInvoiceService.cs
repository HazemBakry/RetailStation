using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Purchase
{
    public interface IPurchaseInvoiceService
    {
        DataTable GetPurchaseInvoicesData(FilterModel model);
        ActionsResponseModel CreateNewPurchaseInvoice(OrderModel model);
        bool CancelPurchaseInvoice(int InvoiceId);
        List<OrderModel> GetInvoicesSearchData(int SupplierId, string InvoiceNumber, string InvoiceDate, int InvoiceId = 0);
        List<OrderModel> GetPurchaseInvoiceDetails(int InvoiceId);
        List<PurchaseReturns> GetPurchasesReturnsData();
        ActionsResponseModel SaveNewPurchaseReturns(OrderModel model);
        bool CancelPurchaseReturns(int ReturnsId);
        List<SupplierStatementModel> GetSupplierStatementData(int SupplierId);
        List<PurchaseInvoiceType> GetInvoiceTypesData();
    }
}
