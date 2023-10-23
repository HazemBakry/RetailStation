using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Finance.Purchase
{
    public interface ISupplirService
    {

        List<Supplier> GetSuppliersData();
        List<Branch> GetBranchesData();
        List<ItemLookups> GetItemLookupsData();
        List<ItemModel> GetItemsData();
        List<ItemModel> GetItemsByLookupId(int LookupId);
        List<ItemModel> GetItemsBySupplierId(int SupplierId);


    }
}
