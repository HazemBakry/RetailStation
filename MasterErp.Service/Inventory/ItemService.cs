using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Common.Inventory.ReceiveOrder;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.Inventory;
using MasterErp.Service.Common;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.Inventory
{
    public class ItemService : IItemService
    {

        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;

        private string ConnectionString
        {
            get
            {
                return Configuration.GetConnectionString("DBConnection");
            }
        }

        public ItemService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
        }

        public List<ItemLookups> GetItemsLookups()
        {
            return Context.ItemLookups.ToList();
        }

        public DataTable GetItemsData()
        {
            var results = (from item in Context.Items
                           join unit in Context.Units on item.UnitID equals unit.UnitId
                           select new ItemModel
                           {
                               ItemId = item.ItemID,
                               ItemNameEn = item.NameEN,
                               ItemNameAr = item.NameAR,
                               Price = item.Price,
                               UnitId = item.UnitID,
                               UnitNameEn = unit.UnitNameEn,
                               UnitNameAr = unit.UnitNameAr
                           }).ToList().ToDataTable();

            return results;
        }

        public DataTable GetItemsBySupplierId(int SupplierId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@SupplierId", SupplierId);

            var result = SQLHelper.ExecuteDataTable("[dbo].[SP_GetItemsBySupplierId]", ConnectionString, param);
            return result;
        }

        public DataTable GetItemsByLookupId(int LookupId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@LookupId", LookupId);

            var result = SQLHelper.ExecuteDataTable("[dbo].[SP_GetItemsByLookupId]", ConnectionString, param);
            return result;
        }

    }
}
