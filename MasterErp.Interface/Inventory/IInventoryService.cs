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
        List<OrderModel> GetOrdersSearchData(int SupplierId, string OrderNumber, string OrderDate, int MaterialReceiptId = 0);

        #region Receive Orders

        List<MaterialReceiptModel> GetMaterialReceipts_Data(SearchFilterModel model, int? MaterialReceiptId = null);
        List<FilterModel> GetMaterialReceipts_Filters(SearchFilterModel PagingFilter);
        MaterialReceiptModel GetMaterialReceiptDetailsById(int MaterialReceiptId);
        List<GeneralOrderDetailsModel> GetMaterialReceiptProducts_Data(List<int> MaterialReceiptIds);
        ActionsResponseModel AddNewMaterialReceipt(MaterialReceiptModel model);
        ActionsResponseModel EditMaterialReceipt(int MaterialReceiptId, MaterialReceiptModel model);
        ActionsResponseModel CancelMaterialReceipt(int MaterialReceiptId);
        ActionsResponseModel AddInvoiceToMaterialReceipts(List<int> MaterialReceiptIds, int InvoiceId);

        #endregion

        #region Delivery Notes

        List<OrderModel> GetDeliveryNotes_Data(SearchFilterModel model, int? MaterialReceiptId = null);
        List<FilterModel> GetDeliveryNotes_Filters(SearchFilterModel PagingFilter);
        OrderModel GetDeliveryNoteDetailsById(int MaterialReceiptId);
        List<OrderProductModel> GetDeliveryNoteProducts_Data(int MaterialReceiptId);
        ActionsResponseModel AddNewDeliveryNote(OrderModel model);
        ActionsResponseModel EditDeliveryNote(int MaterialReceiptId, OrderModel model);
        ActionsResponseModel CancelDeliveryNote(int MaterialReceiptId);

        #endregion

        #region Material Issue

        List<OrderModel> GetMaterialIssue_Data(SearchFilterModel model, int? MaterialReceiptId = null);
        List<FilterModel> GetMaterialIssue_Filters(SearchFilterModel PagingFilter);
        OrderModel GetMaterialIssueDetailsById(int MaterialReceiptId);
        List<OrderProductModel> GetMaterialIssueProducts_Data(int MaterialReceiptId);
        ActionsResponseModel AddNewMaterialIssue(OrderModel model);
        ActionsResponseModel EditMaterialIssue(int MaterialReceiptId, OrderModel model);
        ActionsResponseModel CancelMaterialIssue(int MaterialReceiptId);

        #endregion

        #region Material Requests

        List<MaterialRequestModel> GetMaterialRequests_Data(SearchFilterModel model,int? MaterialRequestId = null);
        MaterialRequestModel GetMaterialRequestDetailsById(int MaterialRequestId);

        ActionsResponseModel CreateNewMaterialRequest(MaterialRequestModel model);
        ActionsResponseModel EditMaterialRequest(int MaterialRequestId, MaterialRequestModel model);
        List<GeneralOrderDetailsModel> GetMaterialRequestProducts_Data(List<int> MaterialRequestIds);
        ActionsResponseModel CancelMaterialRequest(int MaterialRequestId);
        ActionsResponseModel UpdateMaterialRequestPurchaseOrder(int PurchaseMaterialReceiptId,List<int> MaterialRequestIds);

        #endregion
        List<OrderModel> GetSupplierVouchers_Data(SearchFilterModel model, int? MaterialReceiptId = null);
        ActionsResponseModel CancelSupplierVoucher(int MaterialReceiptId);

    }
}
