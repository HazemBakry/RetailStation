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

namespace RetailStation.Interface.SupplierManagement
{
    public interface ISupplierManagementService
    {
        List<MerchantItemModel> GetSupplierItemsData(int SupplierId, SearchFilterModel FilterModel, int? MerchantItemId = null);
        MerchantItemModel GetSupplierItemDetailsById(int SupplierId, int MerchantItemId);
        Task<ActionsResponseModel> AddNewSupplierItem(int SupplierId, MerchantItemModel model);
        Task<ActionsResponseModel> EditSupplierItem(int SupplierId, int MerchantItemId, MerchantItemModel model);
        ActionsResponseModel DeleteSupplierItem(int SupplierId, int MerchantItemId);
        ActionsResponseModel ExportSupplierItem(int SupplierId, string UserName, SearchFilterModel Model);
        ActionsResponseModel ChangeSupplierItemActiveStatus(int SupplierId, int MerchantItemId);
        ActionsResponseModel ItemQuickUpdate(int SupplierId, int MerchantItemId, decimal Price, int UnitId);
        Task<ActionsResponseModel> MapSupplierItem(int SupplierId, int MerchantItemId, int? ItemId);
        Task<ActionsResponseModel> MarkItemAsBestSeller(int MerchantItemId);
        Task<ActionsResponseModel> ImportSupplierItemsFile(int SupplierId,string ImporterName, IFormFile file);

    }
}
