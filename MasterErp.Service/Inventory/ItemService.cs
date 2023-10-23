using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Common.Inventory.ReceiveOrder;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.Inventory;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
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

        public List<ItemLookups> GetItemLookupsData()
        {
            return Context.ItemLookups.ToList();
        }

        public List<ItemModel> GetItemsData()
        {
            var results = (from item in Context.Items
                           join unit in Context.Units on item.UnitID equals unit.UnitId
                           select new ItemModel
                           {
                               ItemId = item.ItemID,
                               NameEN = item.NameEN,
                               NameAR = item.NameAR,
                               Cost = item.Cost,
                               UnitId = item.UnitID,
                               UnitName = unit.UnitNameEn
                           }).ToList();

            return results;
        }

        public List<ItemModel> GetItemsBySupplierId(int SupplierId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@SupplierId", SupplierId);

            var result = SQLHelper.SQLQuery<ItemModel>("[dbo].[SP_GetItemsBySupplierId]", ConnectionString, param);
            return result;
        }

        public List<ItemModel> GetItemsByLookupId(int LookupId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@LookupId", LookupId);

            var result = SQLHelper.SQLQuery<ItemModel>("[dbo].[SP_GetItemsByLookupId]", ConnectionString, param);
            return result;
        }

    }
}
