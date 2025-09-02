using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Finance.Purchases;
using RetailStation.Entities.DTOs.Inventory;
using RetailStation.Entities.DTOs.Purchases;
using RetailStation.Entities.Models;
using RetailStation.Entities.Models.Purchases;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.Purchase
{
    public interface IPurchaseOrderService
    {
        List<PurchaseOrderModel> GetPurchaseOrders_Data(SearchFilterModel PagingFilter, int? OrderId=null);
        List<FilterModel> GetPurchaseOrders_Filters(SearchFilterModel PagingFilter);

        List<GeneralOrderDetailsModel> GetPurchaseOrderProducts_Data(int OrderId);
        ActionsResponseModel AddNewPurchaseOrder(PurchaseOrderModel model);
        PurchaseOrderModel GetPurchaseOrderDetailsById(int OrderId);
        ActionsResponseModel EditPurchaseOrder(int OrderId, PurchaseOrderModel model);
        ActionsResponseModel CancelPurchaseOrder(int OrderId);



        #region PurchaseQuotation
        List<PurchaseQuotationModel> GetPurchaseQuotations_Data(SearchFilterModel model, int? OrderId = null);
        PurchaseQuotationModel GetPurchaseQuotationDetailsById(int PurchaseQuotationId);
        List<PurchaseQuotationDetailsModel> GetPurchaseQuotationProducts_Data(int PurchaseQuotationId);

        ActionsResponseModel AddNewPurchaseQuotation(PurchaseQuotationModel model);
        ActionsResponseModel EditPurchaseQuotation(int PurchaseQuotationId, PurchaseQuotationModel model);
        ActionsResponseModel DeletePurchaseQuotation(int PurchaseQuotationId);
        #endregion

    }
}
