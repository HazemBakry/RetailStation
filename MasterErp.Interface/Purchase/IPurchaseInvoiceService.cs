using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.DTOs.Inventory;
using MasterErp.Entities.DTOs.Purchases;
using MasterErp.Entities.Models.Purchases;
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
        List<PurchaseInvoiceModel> GetPurchaseInvoices_Data(SearchFilterModel model,int? InvoiceId=null);
        PurchaseInvoiceModel GetPurchaseInvoiceDetailsById(int InvoiceId);
        ActionsResponseModel AddNewPurchaseInvoice(PurchaseInvoiceModel model);
        ActionsResponseModel EditPurchaseInvoice(int InvoiceId,PurchaseInvoiceModel model);
        List<GeneralOrderDetailsModel> GetPurchaseInvoiceProducts_Data(int InvoiceId);
        ActionsResponseModel CancelPurchaseInvoice(int InvoiceId);
        List<OrderModel> GetInvoicesSearchData(int SupplierId, string InvoiceNumber, string InvoiceDate, int InvoiceId = 0);
        List<OrderModel> GetPurchaseInvoiceDetails(int InvoiceId);

        List<PurchaseReturnsModel> GetPurchaseReturns_Data(SearchFilterModel model, int? OrderId = null);
        PurchaseReturnsModel GetPurchaseReturnsDetailsById(int OrderId);
        List<GeneralOrderDetailsModel> GetPurchaseReturnsProducts_Data(int OrderId);

        ActionsResponseModel AddNewPurchaseReturns(PurchaseReturnsModel model);
        ActionsResponseModel EditPurchaseReturns(int OrderId, PurchaseReturnsModel model);
        ActionsResponseModel CancelPurchaseReturns(int ReturnsId);
        List<SupplierStatementModel> GetSupplierStatementData(int SupplierId, SearchFilterModel model);
        List<PurchaseInvoiceType> GetInvoiceTypesData();
    }
}
