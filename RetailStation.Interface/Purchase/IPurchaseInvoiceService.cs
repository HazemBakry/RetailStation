using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Finance.Purchases;
using RetailStation.Entities.DTOs.Inventory;
using RetailStation.Entities.DTOs.Purchases;
using RetailStation.Entities.Models.Purchases;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.Purchase
{
    public interface IPurchaseInvoiceService
    {
        List<PurchaseInvoiceModel> GetPurchaseInvoices_Data(SearchFilterModel model,int? InvoiceId=null);
        List<FilterModel> GetPurchaseInvoices_Filters(SearchFilterModel PagingFilter);

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

        #region PurchaseInvoiceType

        List<PurchaseInvoiceTypeModel> GetPurchaseInvoiceTypesData(SearchFilterModel Model, int? PurchaseInvoiceTypeId = null);
        PurchaseInvoiceTypeModel GetPurchaseInvoiceTypeById(int PurchaseInvoiceTypeId);
        ActionsResponseModel CreateNewPurchaseInvoiceType(PurchaseInvoiceTypeModel Model);
        ActionsResponseModel EditPurchaseInvoiceType(int PurchaseInvoiceTypeId, PurchaseInvoiceTypeModel Model);
        ActionsResponseModel DeletePurchaseInvoiceType(int PurchaseInvoiceTypeId);

        #endregion
    }
}
