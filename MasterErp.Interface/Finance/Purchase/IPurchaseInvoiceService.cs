using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Finance.Purchase
{
    public interface IPurchaseInvoiceService
    {
        List<PurchaseInvoice> GetPurchaseInvoiceData();
        List<Supplier> GetSuppliersData();
        List<Branch> GetBranchesData();
        List<ItemLookups> GetItemLookupsData();
        DataTable GetItemsData();
        DataTable GetItemsByLookupId(int LookupId);
        DataTable GetItemsBySupplierId(int SupplierId);
        (bool HasError, string InvoiceNumber) SaveNewPurchaseInvoice(PurchaseInvoiceModel model);
    }
}
