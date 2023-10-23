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
        DataTable GetPurchaseInvoiceData(FilterModel model);
        CreateModifyReturnsModel CreateNewPurchaseInvoice(PurchaseInvoiceModel model);
        bool CancelPurchaseInvoice(int InvoiceId);
        List<PurchaseInvoiceItemsModel> GetInvoicesSearchData(int SupplierId, string InvoiceNumber, string InvoiceDate, int InvoiceId = 0);
        PurchaseInvoiceItemsModel GetInvoiceDetailsById(int InvoiceId);
        List<PurchaseReturns> GetPurchasesReturnsData();
        CreateModifyReturnsModel SaveNewPurchaseReturns(PurchaseReturnsModel model);
        bool CancelPurchaseReturns(int ReturnsId);
        List<SupplierStatementModel> GetSupplierStatementData(int SupplierId);
        List<PurchaseInvoiceType> GetInvoiceTypesData();
    }
}
