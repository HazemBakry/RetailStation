using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Operation;
using RetailStation.Entities.DTOs.Website;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.Operation
{
    public interface IMerchantManagementService
    {
        List<MerchantItemModel> GetMerchantItems_Data(int MerchantId, SearchFilterModel FilterModel, int? MerchantItemId = null);
        List<FilterModel> GetMerchantItems_Filters(int MerchantId, SearchFilterModel PagingFilter);
        MerchantItemModel GetMerchantItemDetailsById(int MerchantId, int MerchantItemId);
        Task<ActionsResponseModel> AddNewMerchantItem(int MerchantId, MerchantItemModel model);
        Task<ActionsResponseModel> EditMerchantItem(int MerchantId, int MerchantItemId, MerchantItemModel model);
        ActionsResponseModel DeleteMerchantItem(int MerchantId, int MerchantItemId);
        ActionsResponseModel ExportMerchantItem(int MerchantId, string UserName, SearchFilterModel Model);
        ActionsResponseModel ChangeMerchantItemActiveStatus(int MerchantId, int MerchantItemId);
        ActionsResponseModel ItemQuickUpdate(int MerchantId, int MerchantItemId, decimal Price, int UnitId);
        Task<ActionsResponseModel> MapMerchantItem(int MerchantId, int MerchantItemId, int? ItemId);
        Task<ActionsResponseModel> MarkItemAsBestSeller(int MerchantItemId);
        Task<ActionsResponseModel> ImportMerchantItemsFile(int MerchantId, string ImporterName, IFormFile file);


        #region Orders

        List<WebsiteOrderModel> GetOrders_Data(SearchFilterModel model, int MerchantId, int? OrderId = null);
        List<WebsiteOrderItemModel> GetOrder_Items(int MerchantId,int OrderId);
        List<FilterModel> GetOrders_Filters(SearchFilterModel PagingFilter, int MerchantId);
        WebsiteOrderModel GetOrderDetailsById(int MerchantId, int OrderId);
        ActionsResponseModel CancelOrder(int MerchantId,int OrderId);
        #endregion
        #region Branch

        List<BranchModel> GetBranches_Data(int merchantId, SearchFilterModel filterModel, int? branchId = null);
        BranchModel GetBranchById(int merchantId, int branchId);
        Task<ActionsResponseModel> AddBranch(int merchantId, BranchModel model);
        Task<ActionsResponseModel> EditBranch(int merchantId, int branchId, BranchModel model);
        ActionsResponseModel DeleteBranch(int merchantId, int branchId);
        ActionsResponseModel ChangeBranchActiveStatus(int merchantId, int branchId);



        #endregion

        #region Promotions
        List<PromotionModel> GetPromotions_Data(int merchantId, SearchFilterModel filterModel, int? promotionId = null);
        PromotionModel GetPromotionById(int merchantId, int promotionId);
        Task<ActionsResponseModel> AddPromotion(int merchantId, PromotionModel model);
        Task<ActionsResponseModel> EditPromotion(int merchantId, int promotionId, PromotionModel model);
        ActionsResponseModel DeletePromotion(int merchantId, int promotionId);
        ActionsResponseModel ChangePromotionActiveStatus(int merchantId, int promotionId);
        Task<ActionsResponseModel> ApprovePromotionToDisplay(int merchantId, int promotionId);

        #endregion

    }
}
