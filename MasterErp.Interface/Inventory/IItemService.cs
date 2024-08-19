using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Common.Inventory.ReceiveOrder;
using MasterErp.Entities.DTOs.Shared;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Inventory
{
    public interface IItemService
    {
        List<ItemLookups> GetItemsLookups();
        DataTable GetItemsData();
        DataTable GetItemsByLookupId(int LookupId);
        DataTable GetItemsBySupplierId(int SupplierId);
        DataTable GetItemsListByCategoryId(int ItemCategoryId, string SearchText);
        DataTable GetItemsDeleted(int ItemCategoryId, string SearchText);
        List<ItemCategory> GetItemCategories();
        List<Item> GetItemsByCategoryId(int CategoryId);
        ItemSaveDTO GetItemDetailsByItemId(int ItemId);
        bool AddNewItem(ItemSaveDTO model);
        bool EditItem(ItemSaveDTO model);
        (int key, string message) DeleteItem(int ItemId);
        string ExportAllItems(int categoryId, string SearchText, string UserName);
        string ExportItemsDeleted(int categoryId, string SearchText, string UserName);
        ActionsResponseModel AddUnit(Unit model);
        ActionsResponseModel EditUnit(Unit model);
        ActionsResponseModel DeleteUnit(int UnitId);
        List<Unit> GetUnits();
        ActionsResponseModel ChangeItemStatus(int ItemId);
    }
}
