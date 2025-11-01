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
        List<SupplierItemModel> GetSupplierItemsData(int SupplierId, SearchFilterModel FilterModel, int? SupplierItemId = null);
        SupplierItemModel GetSupplierItemDetailsById(int SupplierId, int SupplierItemId);
        Task<ActionsResponseModel> AddNewSupplierItem(int SupplierId, SupplierItemModel model);
        Task<ActionsResponseModel> EditSupplierItem(int SupplierId, int SupplierItemId, SupplierItemModel model);
        ActionsResponseModel DeleteSupplierItem(int SupplierId, int SupplierItemId);
        ActionsResponseModel ExportSupplierItem(int SupplierId, string UserName, SearchFilterModel Model);
        ActionsResponseModel ChangeSupplierItemActiveStatus(int SupplierId, int SupplierItemId);
        ActionsResponseModel ItemQuickUpdate(int SupplierId, int SupplierItemId, decimal Price, int UnitId);
        Task<ActionsResponseModel> MapSupplierItem(int SupplierId, int SupplierItemId, int? ItemId);
        Task<ActionsResponseModel> MarkItemAsBestSeller(int SupplierItemId);
        Task<ActionsResponseModel> ImportSupplierItemsFile(int SupplierId,string ImporterName, IFormFile file);

    }
}
