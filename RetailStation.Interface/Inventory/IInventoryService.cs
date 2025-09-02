using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Finance.Purchases;
using RetailStation.Entities.Common.Inventory.ReceiveOrder;
using RetailStation.Entities.DTOs.HR;
using RetailStation.Entities.DTOs.Inventory;
using RetailStation.Entities.Models.Inventory;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.Inventory
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

        List<MaterialIssueModel> GetMaterialIssue_Data(SearchFilterModel model, int? MaterialIssueId = null);
        List<FilterModel> GetMaterialIssue_Filters(SearchFilterModel PagingFilter);
        MaterialIssueModel GetMaterialIssueDetailsById(int MaterialIssueId);
        List<GeneralOrderDetailsModel> GetMaterialIssueProducts_Data(int MaterialIssueId);
        ActionsResponseModel AddNewMaterialIssue(MaterialIssueModel model);
        ActionsResponseModel EditMaterialIssue(int MaterialIssueId, MaterialIssueModel model);
        ActionsResponseModel CancelMaterialIssue(int MaterialIssueId);

        #endregion

        #region Material Requests

        List<MaterialRequestModel> GetMaterialRequests_Data(SearchFilterModel model,int? MaterialRequestId = null);
        List<FilterModel> GetMaterialRequests_Filters(SearchFilterModel PagingFilter);

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
