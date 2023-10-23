using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Common.Inventory.ReceiveOrder;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Inventory
{
    public interface IItemService
    {
        List<ItemLookups> GetItemLookupsData();
        List<ItemModel> GetItemsData();
        List<ItemModel> GetItemsByLookupId(int LookupId);
        List<ItemModel> GetItemsBySupplierId(int SupplierId);
    }
}
