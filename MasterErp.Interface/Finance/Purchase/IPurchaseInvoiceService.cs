using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Finance.Purchase
{
    public interface IPurchaseInvoiceService
    {
        DataTable GetPurchaseInvoicesSummary(FilterModel model);
        ActionsResponseModel CreateNewPurchaseInvoice(PurchaseInvoiceModel model);
        bool CancelPurchaseInvoice(int InvoiceId);
        List<PurchaseInvoiceModel> GetInvoicesSearchData(int SupplierId, string InvoiceNumber, string InvoiceDate, int InvoiceId = 0);
        List<PurchaseInvoiceModel> GetPurchaseInvoiceDetails(int InvoiceId);
        List<PurchaseReturns> GetPurchasesReturnsData();
        ActionsResponseModel SaveNewPurchaseReturns(PurchaseReturnsModel model);
        bool CancelPurchaseReturns(int ReturnsId);
        List<SupplierStatementModel> GetSupplierStatementData(int SupplierId);
        List<PurchaseInvoiceType> GetInvoiceTypesData();
    }
}
