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
        #region PurchasesInvoices

        List<PurchaseInvoice> GetPurchaseInvoiceData();
        CreateModifyReturnsModel SaveNewPurchaseInvoice(PurchaseInvoiceModel model);
        bool CancelPurchaseInvoice(int InvoiceId);
        List<PurchaseInvoiceItemsModel>  GetInvoicesSearchData(int SupplierId, string InvoiceNumber, string InvoiceDate, int InvoiceId = 0);
        PurchaseInvoiceItemsModel GetInvoiceDetailsById(int InvoiceId);

        #endregion


        #region PurchasesOrders

        List<PurchaseOrder> GetPurchasesOrdersData();
        CreateModifyReturnsModel SaveNewPurchaseOrder(PurchaseOrderModel model);
        bool CancelPurchaseOrder(int OrderId);


        #endregion


        #region PurchasesReturns

        List<PurchaseReturns> GetPurchasesReturnsData();
        CreateModifyReturnsModel SaveNewPurchaseReturns(PurchaseReturnsModel model);
        bool CancelPurchaseReturns(int ReturnsId);

        #endregion



        #region SuppliersStatement
        List<SupplierStatementModel> GetSupplierStatementData(int SupplierId);


        #endregion



        List<PurchaseInvoiceType> GetInvoiceTypesData();
        List<Supplier> GetSuppliersData();
        List<Branch> GetBranchesData();
        List<ItemLookups> GetItemLookupsData();
        List<ItemModel> GetItemsData();
        List<ItemModel> GetItemsByLookupId(int LookupId);
        List<ItemModel> GetItemsBySupplierId(int SupplierId);


    }
}
