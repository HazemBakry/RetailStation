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
        List<ItemDto> GetItems(int CategoryId,SearchFilterModel Model,int? ItemId=null);
        ItemDto GetItemById(int ItemId);
        ActionsResponseModel AddNewItem(ItemDto model);
        ActionsResponseModel EditItem(int ItemId,ItemDto model);
        ActionsResponseModel DeleteItem(int ItemId);
        string ExportItems(int categoryId, string UserName, SearchFilterModel Model);

        List<SupplierDto> GetItemSuppliersByItemId(int ItemId);
        List<ItemDto> GetItemsBySupplierId(int SupplierId);
        DataTable GetItemsBySupplierIdV2(int SupplierId);


        #endregion
        List<ItemLookups> GetItemsLookups();

        DataTable GetItemsByLookupId(int LookupId);
        DataTable GetItemsDeleted(int ItemCategoryId, string SearchText);
        List<ItemCategory> GetItemCategories();
        List<Item> GetItemsByCategoryId(int CategoryId);

        string ExportItemsDeleted(int categoryId, string SearchText, string UserName);
        ActionsResponseModel AddUnit(Unit model);
        ActionsResponseModel EditUnit(Unit model);
        ActionsResponseModel DeleteUnit(int UnitId);
        List<Unit> GetUnits();
        ActionsResponseModel ChangeItemStatus(int ItemId);
    }
}
