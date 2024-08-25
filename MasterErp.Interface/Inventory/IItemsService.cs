using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Common.Inventory.ReceiveOrder;
using MasterErp.Entities.DTOs.Inventory;
using MasterErp.Entities.DTOs.Purchases;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Inventory
{
    public interface IItemsService
    {
        #region Item

        List<ItemDto> GetItemsData(SearchFilterModel FilterModel, int? ItemId = null);
        ItemDto GetItemDetailsById(int ItemId);
        ActionsResponseModel AddNewItem(ItemDto model);
        ActionsResponseModel EditItem(int ItemId, ItemDto model);
        ActionsResponseModel DeleteItem(int ItemId);
        ActionsResponseModel ExportItems(int categoryId, string UserName, SearchFilterModel Model);
        List<ItemDto> GetItemsBySupplierId(int SupplierId);
        DataTable GetItemsBySupplierIdV2(int SupplierId);
        List<ItemDto> GetItemsByLookupId(int LookupId);
        ActionsResponseModel ChangeItemStatus(int ItemId);
        List<ItemLookups> GetItemsLookups();
        List<ItemDto> GetItemsDeleted(int ItemCategoryId, string SearchText);
        string ExportItemsDeleted(int categoryId, string SearchText, string UserName);
        #endregion

        #region Item Categories
        List<ItemCategoryModel> GetItemCategories(int? CategoryId=null);
        ItemCategoryModel GetItemCategoryDetails(int CategoryId);
        ActionsResponseModel AddNewItemCategory(ItemCategoryModel model);
        ActionsResponseModel EditItemCategory(int CategoryId, ItemCategoryModel model);
        ActionsResponseModel DeleteItemCategory(int CategoryId);
        ActionsResponseModel ChangeItemCategoryActiveStatus(int CategoryId);
        ActionsResponseModel ChangeCategoriesDisplayOrder(List<CategorySortModel> Categories);
        ActionsResponseModel ExportCategories(int categoryId, string UserName, SearchFilterModel Model);
        #endregion

        #region Units
        ActionsResponseModel AddUnit(Unit model);
        ActionsResponseModel EditUnit(Unit model);
        ActionsResponseModel DeleteUnit(int UnitId);
        List<Unit> GetUnits();
        #endregion
    }
}
