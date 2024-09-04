using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.DTOs.Purchases;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Purchase
{
    public interface IPurchaseOrderService
    {
        List<OrderModel> GetPurchaseOrders_Data(SearchFilterModel PagingFilter, int? OrderId=null);
        List<OrderProductModel> GetPurchaseOrderProducts_Data(int OrderId);
        ActionsResponseModel CreateNewPurchaseOrder(OrderModel model);
        bool CancelPurchaseOrder(int OrderId);



        #region PurchaseQuotation
        List<PurchaseQuotationModel> GetPurchaseQuotations_Data(SearchFilterModel model, int? OrderId = null);
        PurchaseQuotationModel GetPurchaseQuotationDetailsById(int OrderId);
        List<PurchaseQuotationDetailsModel> GetPurchaseQuotationProducts_Data(int OrderId);

        ActionsResponseModel AddNewPurchaseQuotation(PurchaseQuotationModel model);
        ActionsResponseModel EditPurchaseQuotation(int OrderId, PurchaseQuotationModel model);
        #endregion

    }
}
