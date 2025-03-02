using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Common.Inventory.ReceiveOrder;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.DTOs.Inventory;
using MasterErp.Entities.Models.Inventory;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Inventory
{
    public interface IInventoryService
    {

        List<Store> GetInventoryList();
        List<StatisticsCardSummary> GetInventoryStatistics();
        List<OrderModel> GetOrdersSearchData(int SupplierId, string OrderNumber, string OrderDate, int OrderId = 0);

        #region Receive Orders

        List<OrderModel> GetReceiveOrders_Data(SearchFilterModel model, int? OrderId = null);
        List<FilterModel> GetReceiveOrders_Filters(SearchFilterModel PagingFilter);
        OrderModel GetReceiveOrderDetailsById(int OrderId);
        List<OrderProductModel> GetReceiveOrderProducts_Data(List<int> OrderIds);
        ActionsResponseModel AddNewReceiveOrder(OrderModel model);
        ActionsResponseModel EditReceiveOrder(int OrderId, OrderModel model);
        ActionsResponseModel CancelReceiveOrder(int OrderId);
        ActionsResponseModel AddInvoiceToReceiveOrders(List<int> OrderIds, int InvoiceId);

        #endregion

        #region Delivery Orders

        List<OrderModel> GetDeliveryOrders_Data(SearchFilterModel model, int? OrderId = null);
        OrderModel GetDeliveryOrderDetailsById(int OrderId);
        List<OrderProductModel> GetDeliveryOrderProducts_Data(int OrderId);
        ActionsResponseModel AddNewDeliveryOrder(OrderModel model);
        ActionsResponseModel EditDeliveryOrder(int OrderId, OrderModel model);
        ActionsResponseModel CancelDeliveryOrder(int OrderId);

        #endregion

        #region Purchase Requests

        PagedResponseModel<PurchasesRequestDTO> GetPurchasesRequestsData(FilterModel model);
        ActionsResponseModel CreateNewPurchasesRequest(OrderModel model);
        public ActionsResponseModel CancelPurchaseRequest(int OrderId);

        #endregion
        List<OrderModel> GetSupplierVouchers_Data(SearchFilterModel model, int? OrderId = null);
        ActionsResponseModel CancelSupplierVoucher(int OrderId);

    }
}
