using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Common.Inventory.ReceiveOrder;
using MasterErp.Entities.DTOs.Shared;
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
        private readonly string ConnectionString;

        public ItemService(DBContext Context, ISQLHelper SQLHelper, IConfiguration Configuration)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.Configuration = Configuration;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
        }

        public List<ItemLookups> GetItemsLookups()
        {
            return Context.ItemLookups.ToList();
        }

        public DataTable GetItemsData()
        {
            var results = (from item in Context.Items
                           join unit in Context.Units on item.MainUnitId equals unit.UnitId
                           select new ItemSaveDTO
                           {
                               ItemId = item.ItemId,
                               NameEN = item.NameEN,
                               NameAR = item.NameAR,
                               Cost = item.Cost,
                               MainUnitId = item.MainUnitId,
                               MainUnitName = unit.NameEN,
                               ItemCategoryId = item.ItemCategoryId
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

        public DataTable GetItemsListByCategoryId(int ItemCategoryId, string SearchText)
        {
            var results = (from item in Context.Items
                           join unit in Context.Units on item.MainUnitId equals unit.UnitId
                           where item.ItemCategoryId == ItemCategoryId
                           select new ItemSaveDTO
                           {
                               ItemId = item.ItemId,
                               NameEN = item.NameEN,
                               NameAR = item.NameAR,
                               Cost = item.Cost,
                               MainUnitId = item.MainUnitId,
                               MainUnitName = unit.NameEN,
                               ItemCategoryId = item.ItemCategoryId
                           }).ToList().ToDataTable();

            return results;

            //SqlParameter[] Params = new SqlParameter[2];

            //string SearchParam = SearchText == "undefined" || SearchText == "null" ? null : SearchText;
            //Params[0] = new SqlParameter("@RawCategoryID", (object)RawCategoryId ?? DBNull.Value);
            //Params[1] = new SqlParameter("@SearchText", (object)SearchParam ?? DBNull.Value);

            //var results = SQLHelper.ExecuteDataTable("[dbo].[SP_GetItemsList]", ConnectionString, Params);
            //return results;
        }

        public DataTable GetItemsDeleted(int RawCategoryId, string SearchText)
        {

            SqlParameter[] Params = new SqlParameter[2];

            string SearchParam = SearchText == "undefined" || SearchText == "null" ? null : SearchText;
            Params[0] = new SqlParameter("@RawCategoryID", (object)RawCategoryId ?? DBNull.Value);
            Params[1] = new SqlParameter("@SearchText", (object)SearchParam ?? DBNull.Value);

            var results = SQLHelper.ExecuteDataTable("[dbo].[SP_GetItemsDeleted]", ConnectionString, Params);
            return results;
        }

        public List<ItemCategory> GetItemCategories()
        {
            var results = Context.ItemCategories.ToList();
            return results;
        }

        public List<Item> GetItemsByCategoryId(int CategoryId)
        {
            var results = Context.Items.Where(i => i.ItemCategoryId == CategoryId).ToList();
            return results;
        }

        public ItemSaveDTO GetItemDetailsByItemId(int ItemId)
        {
            SqlParameter[] Params = new SqlParameter[1];

            Params[0] = new SqlParameter("@ItemId", (object)ItemId ?? DBNull.Value);

            var dt = SQLHelper.SQLQuery<ItemSaveDTO>("[dbo].[SP_GetItemDetailsByItemId]", ConnectionString, Params);
            var grpList = dt.GroupBy(x => new { x.ItemId })
                .Select(f => new ItemSaveDTO
                {
                    ItemId = f.FirstOrDefault().ItemId,
                    NameEN = f.FirstOrDefault().NameEN,
                    NameAR = f.FirstOrDefault().NameAR,
                    SubUnitId = f.FirstOrDefault().SubUnitId,
                    MainUnitId = f.FirstOrDefault().MainUnitId,
                    ItemCategoryId = f.FirstOrDefault().ItemCategoryId,
                    CategoryName = f.FirstOrDefault().CategoryName,
                    SubUnitName = f.FirstOrDefault().SubUnitName,
                    MainUnitName = f.FirstOrDefault().MainUnitName,
                    Cost = f.FirstOrDefault().Cost,
                    PurchasePrice = f.FirstOrDefault().PurchasePrice,
                    Yield = f.FirstOrDefault().Yield,
                    ItemType = f.FirstOrDefault().ItemType,
                    ConvertRatio = f.FirstOrDefault().ConvertRatio,
                    IsActive = f.FirstOrDefault().IsActive,
                    ItemSuppliers = f.Where(y => !string.IsNullOrEmpty(y.SupplierName)).GroupBy(x => new { x.SupplierId }).Select(x => new ItemSupplier
                    {
                        SupplierId = (int)x.FirstOrDefault().SupplierId,
                        ItemId = x.FirstOrDefault().ItemId,
                        SupplierName = x.FirstOrDefault().SupplierName,
                        ItemName = x.FirstOrDefault().NameEN,
                    }).ToList(),
                }).FirstOrDefault();

            return grpList;
        }

        public bool AddNewItem(ItemSaveDTO model)
        {
            try
            {
                Item Item = new Item
                {
                    NameAR = model.NameAR,
                    NameEN = model.NameEN,
                    Cost = (double)model.Cost,
                    PurchasePrice = model.PurchasePrice,
                    Yield = model.Yield,
                    ConvertRatio = model.ConvertRatio,
                    SubUnitId = model.SubUnitId,
                    MainUnitId = (int)model.MainUnitId,
                    ItemCategoryId = (int)model.ItemCategoryId,
                    CreatedBy = model.CreatedBy,
                    CreatedDate = DateTime.Now,
                    IsActive = (bool)model.IsActive,
                    ItemType = model.ItemType
                };

                Context.Items.Add(Item);
                Context.SaveChanges();

                foreach (var itemSub in model.ItemSuppliers)
                {
                    Context.ItemSuppliers.Add(new ItemSupplier
                    {
                        ItemId = Item.ItemId,
                        SupplierId = itemSub.SupplierId
                    });

                    Context.SaveChanges();
                }

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool EditItem(ItemSaveDTO model)
        {
            var item = Context.Items.Where(i => i.ItemId == model.ItemId).FirstOrDefault();
            if (item != null)
            {
                item.NameAR = model.NameAR;
                item.NameEN = model.NameEN;
                item.Cost = (double)model.Cost;
                item.PurchasePrice = model.PurchasePrice;
                item.Yield = model.Yield;
                item.ConvertRatio = model.ConvertRatio;
                item.SubUnitId = model.SubUnitId;
                item.MainUnitId = (int)model.MainUnitId;
                item.ItemCategoryId = (int)model.ItemCategoryId;
                item.CreatedBy = model.CreatedBy;
                item.CreatedDate = DateTime.Now;
                item.IsActive = (bool)model.IsActive;
                Context.SaveChanges();

                var ItemsSupplier = Context.ItemSuppliers.Where(x => x.ItemId == model.ItemId).ToList();
                Context.ItemSuppliers.RemoveRange(ItemsSupplier);
                Context.SaveChanges();

                foreach (var itemSub in model.ItemSuppliers)
                {
                    Context.ItemSuppliers.Add(new ItemSupplier
                    {
                        ItemId = item.ItemId,
                        SupplierId = itemSub.SupplierId
                    });

                    Context.SaveChanges();
                }

                return true;
            }
            else
                return false;
        }

        public (int key, string message) DeleteItem(int ItemId)
        {
            try
            {
                var item = Context.Items.FirstOrDefault(m => m.ItemId == ItemId);
                if (item != null)
                {
                    Context.Remove(item);
                    Context.SaveChanges();
                }
                return (200, "Item Removed Successfully");
            }
            catch (Exception ex)
            {
                return (100, "Item Not Found");
            }
        }

        public DataTable GetAllItemsExportData(int categoryId, string SearchText)
        {
            SqlParameter[] Params = new SqlParameter[2];
            string SearchParam = SearchText == "undefined" || SearchText == "null" ? null : SearchText;
            Params[0] = new SqlParameter("@ItemCategoryID", (object)categoryId ?? DBNull.Value);
            Params[1] = new SqlParameter("@SearchText", (object)SearchParam ?? DBNull.Value);

            return SQLHelper.ExecuteDataTable("[dbo].[SP_GetAllItemsExportData]", ConnectionString, Params);
        }

        public DataTable GetItemsDeletedExportData(int categoryId, string SearchText)
        {
            SqlParameter[] Params = new SqlParameter[2];
            string SearchParam = SearchText == "undefined" || SearchText == "null" ? null : SearchText;
            Params[0] = new SqlParameter("@ItemCategoryID", (object)categoryId ?? DBNull.Value);
            Params[1] = new SqlParameter("@SearchText", (object)SearchParam ?? DBNull.Value);

            return SQLHelper.ExecuteDataTable("[dbo].[SP_GetItemsDeletedExportData]", ConnectionString, Params);
        }

        public string ExportAllItems(int categoryId, string SearchText, string UserName)
        {
            var dt = GetAllItemsExportData(categoryId, SearchText);
            var filePath = GetExportFilePath(dt, UserName, "ItemsDisabled");

            return filePath;
        }

        public string ExportItemsDeleted(int categoryId, string SearchText, string UserName)
        {
            var dt = GetItemsDeletedExportData(categoryId, SearchText);
            var filePath = GetExportFilePath(dt, UserName, "ItemsDisabled");

            return filePath;
        }

        private string GetExportFilePath(DataTable dt, string UserName, string TemplateName)
        {
            //ExportTemplateBase exportTemplateBase = new ExportTemplateBase
            //{
            //    Name = "Items",
            //    TemplateName = TemplateName,
            //    UserName = UserName
            //};
            //var filePath = _exportManager.Export(exportTemplateBase, ExportFormat.Excel, dt);
            //return filePath;
            return "";
        }

        public ActionsResponseModel AddUnit(Unit model)
        {
            try
            {
                Context.Add(new Unit
                {
                    NameAR = model.NameAR,
                    NameEN = model.NameEN
                });

                Context.SaveChanges();
                return new ActionsResponseModel
                {
                    Status = 1,
                    Message = "تم حفظ البيانات بنجاح"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    Status = 0,
                    Message = ex.InnerException?.Message ?? ex.Message
                };
            }
        }

        public ActionsResponseModel EditUnit(Unit model)
        {
            var Item = Context.Units.Where(x => x.UnitId == model.UnitId).FirstOrDefault();

            if (Item != null)
            {
                Item.NameAR = model.NameAR;
                Item.NameEN = model.NameEN;

                Context.SaveChanges();
                return new ActionsResponseModel
                {
                    Status = 1,
                    Message = "تم حفظ البيانات بنجاح"
                };
            }
            else
            {
                return new ActionsResponseModel
                {
                    Status = 0,
                    Message = "يرجى اختبار الوحدة المراد تعديلها"
                };
            }
        }
        public ActionsResponseModel DeleteUnit(int UnitId)
        {
            var item = Context.Units.FirstOrDefault(m => m.UnitId == UnitId);

            if (item != null)
            {
                Context.Remove(item);
                Context.SaveChanges();

                return new ActionsResponseModel
                {
                    Status = 1,
                    Message = "تم حذف البيانات بنجاح"
                };
            }
            else
            {
                return new ActionsResponseModel
                {
                    Status = 0,
                    Message = "يرجى اختبار الوحدة المراد حذفها"
                };
            }
        }
        public ActionsResponseModel ChangeItemStatus(int ItemId)
        {
            try
            {
                var item = Context.Items.Where(a => a.ItemId == ItemId).FirstOrDefault();

                if (item.IsActive)
                {
                    item.IsActive = false;
                }
                else
                {
                    item.IsActive = true;
                }
                Context.SaveChanges();

                return new ActionsResponseModel
                {
                    Status = 1,
                    Message = "تم حفظ البيانات بنجاح"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    Status = 0,
                    Message = ex.InnerException?.Message ?? ex.Message
                };
            }
        }

        public List<Unit> GetUnits()
        {
            var results = Context.Units.ToList();
            return results;
        }
    }
}
