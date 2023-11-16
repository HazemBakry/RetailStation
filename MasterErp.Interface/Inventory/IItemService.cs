using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Common.Inventory.ReceiveOrder;
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


        DataTable GetItemsList(int RawCategoryId, string SearchText);
        DataTable GetRawItemsDeleted(int RawCategoryId, string SearchText);
        List<RawItemCategory> GetAllRawItemCategories();
        List<RawItem> GetRawItemsByCategoryId(int CategoryId);
        RawItemModel GetRawItemDetailsByRawItemId(int RawItemId);
        bool AddNewRawItem(RawItemModel model);
        bool EditRawItem(RawItemModel model);
        (int key, string message) DeleteRawItem(int RawItemId);
        string ExportAllRawItems(int categoryId, string SearchText, string UserName);
        string ExportRawItemsDeleted(int categoryId, string SearchText, string UserName);
    }
}
