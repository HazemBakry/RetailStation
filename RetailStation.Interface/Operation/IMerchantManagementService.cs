using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Operation;
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
        List<MerchantItemModel> GetMerchantItemsData(int MerchantId, SearchFilterModel FilterModel, int? MerchantItemId = null);
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

    }
}
