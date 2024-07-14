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




        public DataTable GetItemsList(int RawCategoryId, string SearchText)
        {

            SqlParameter[] Params = new SqlParameter[2];

            string SearchParam = SearchText == "undefined" || SearchText == "null" ? null : SearchText;
            Params[0] = new SqlParameter("@RawCategoryID", (object)RawCategoryId ?? DBNull.Value);
            Params[1] = new SqlParameter("@SearchText", (object)SearchParam ?? DBNull.Value);

            var results = SQLHelper.ExecuteDataTable("[dbo].[SP_GetItemsList]", ConnectionString, Params);
            return results;
        }

        public DataTable GetRawItemsDeleted(int RawCategoryId, string SearchText)
        {

            SqlParameter[] Params = new SqlParameter[2];

            string SearchParam = SearchText == "undefined" || SearchText == "null" ? null : SearchText;
            Params[0] = new SqlParameter("@RawCategoryID", (object)RawCategoryId ?? DBNull.Value);
            Params[1] = new SqlParameter("@SearchText", (object)SearchParam ?? DBNull.Value);

            var results = SQLHelper.ExecuteDataTable("[dbo].[SP_GetRawItemsDeleted]", ConnectionString, Params);
            return results;
        }

        public List<RawItemCategory> GetAllRawItemCategories()
        {
            var results = Context.RawItemCategories.ToList();
            return results;
        }

        public List<RawItem> GetRawItemsByCategoryId(int CategoryId)
        {
            var results = Context.RawItems.Where(i => i.RawCategoryId == CategoryId).ToList();
            return results;
        }

        public RawItemModel GetRawItemDetailsByRawItemId(int RawItemId)
        {
            SqlParameter[] Params = new SqlParameter[1];

            Params[0] = new SqlParameter("@RawItemId", (object)RawItemId ?? DBNull.Value);

            var dt = SQLHelper.SQLQuery<RawItemModel>("[dbo].[SP_GetRawItemDetailsByRawItemId]", ConnectionString, Params);
            var grpList = dt.GroupBy(x => new { x.RawItemId })
                .Select(f => new RawItemModel
                {
                    RawItemId = f.FirstOrDefault().RawItemId,
                    NameEn = f.FirstOrDefault().NameEn,
                    NameAr = f.FirstOrDefault().NameAr,
                    SubUnitId = f.FirstOrDefault().SubUnitId,
                    MainUnitId = f.FirstOrDefault().MainUnitId,
                    RawCategoryId = f.FirstOrDefault().RawCategoryId,
                    CategoryName = f.FirstOrDefault().CategoryName,
                    SubUnitName = f.FirstOrDefault().SubUnitName,
                    MainUnitName = f.FirstOrDefault().MainUnitName,
                    Cost = f.FirstOrDefault().Cost,
                    PurchasePrice = f.FirstOrDefault().PurchasePrice,
                    Yield = f.FirstOrDefault().Yield,
                    ItemType = f.FirstOrDefault().ItemType,
                    ConvertRatio = f.FirstOrDefault().ConvertRatio,
                    IsActive = f.FirstOrDefault().IsActive,
                    ItemsSupplier = f.Where(y => !string.IsNullOrEmpty(y.SupplierName)).GroupBy(x => new { x.SupplierId }).Select(x => new ItemSupplier
                    {
                        SupplierId = x.FirstOrDefault().SupplierId,
                        ItemId = x.FirstOrDefault().SupplierItemId,
                        SupplierName = x.FirstOrDefault().SupplierName,
                        ItemName = x.FirstOrDefault().SupplierItemName,
                    }).ToList(),
                }).FirstOrDefault();

            return grpList;
        }

        public bool AddNewRawItem(RawItemModel model)
        {
            try
            {
                RawItem rawItem = new RawItem
                {
                    NameAr = model.NameAr,
                    NameEn = model.NameEn,
                    Cost = model.Cost,
                    PurchasePrice = model.PurchasePrice,
                    Yield = model.Yield,
                    ConvertRatio = model.ConvertRatio,
                    SubUnitId = model.SubUnitId,
                    MainUnitId = model.MainUnitId,
                    UnitId = model.MainUnitId,
                    RawCategoryId = model.RawCategoryId,
                    InsertUser = model.InsertUser,
                    InsertDate = DateTime.Now,
                    IsActive = model.IsActive,
                    ItemType = model.ItemType
                };

                Context.RawItems.Add(rawItem);
                Context.SaveChanges();

                foreach (var itemSub in model.ItemsSupplier)
                {
                    Context.ItemSuppliers.Add(new ItemSupplier
                    {
                        ItemId = rawItem.RawItemId,
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

        public bool EditRawItem(RawItemModel model)
        {
            var rawItem = Context.RawItems.Where(i => i.RawItemId == model.RawItemId).FirstOrDefault();
            if (rawItem != null)
            {
                rawItem.NameAr = model.NameAr;
                rawItem.NameEn = model.NameEn;
                rawItem.Cost = model.Cost;
                rawItem.PurchasePrice = model.PurchasePrice;
                rawItem.Yield = model.Yield;
                rawItem.ConvertRatio = model.ConvertRatio;
                rawItem.SubUnitId = model.SubUnitId;
                rawItem.MainUnitId = model.MainUnitId;
                rawItem.RawCategoryId = model.RawCategoryId;
                rawItem.InsertUser = model.InsertUser;
                rawItem.InsertDate = DateTime.Now;
                rawItem.IsActive = model.IsActive;
                Context.SaveChanges();

                var ItemsSupplier = Context.ItemSuppliers.Where(x => x.ItemId == model.RawItemId).ToList();
                Context.ItemSuppliers.RemoveRange(ItemsSupplier);
                Context.SaveChanges();

                foreach (var itemSub in model.ItemsSupplier)
                {
                    Context.ItemSuppliers.Add(new ItemSupplier
                    {
                        ItemId = rawItem.RawItemId,
                        SupplierId = itemSub.SupplierId
                    });

                    Context.SaveChanges();
                }

                return true;
            }
            else
                return false;
        }

        public (int key, string message) DeleteRawItem(int RawItemId)
        {
            try
            {
                var item = Context.RawItems.FirstOrDefault(m => m.RawItemId == RawItemId);
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

        public DataTable GetAllRawItemsExportData(int categoryId, string SearchText)
        {
            SqlParameter[] Params = new SqlParameter[2];
            string SearchParam = SearchText == "undefined" || SearchText == "null" ? null : SearchText;
            Params[0] = new SqlParameter("@RawCategoryID", (object)categoryId ?? DBNull.Value);
            Params[1] = new SqlParameter("@SearchText", (object)SearchParam ?? DBNull.Value);

            return SQLHelper.ExecuteDataTable("[dbo].[SP_GetAllRawItemsExportData]", ConnectionString, Params);
        }

        public DataTable GetRawItemsDeletedExportData(int categoryId, string SearchText)
        {
            SqlParameter[] Params = new SqlParameter[2];
            string SearchParam = SearchText == "undefined" || SearchText == "null" ? null : SearchText;
            Params[0] = new SqlParameter("@RawCategoryID", (object)categoryId ?? DBNull.Value);
            Params[1] = new SqlParameter("@SearchText", (object)SearchParam ?? DBNull.Value);

            return SQLHelper.ExecuteDataTable("[dbo].[SP_GetRawItemsDeletedExportData]", ConnectionString, Params);
        }

        public string ExportAllRawItems(int categoryId, string SearchText, string UserName)
        {
            var dt = GetAllRawItemsExportData(categoryId, SearchText);
            var filePath = GetExportFilePath(dt, UserName, "RawItemsDisabled");

            return filePath;
        }

        public string ExportRawItemsDeleted(int categoryId, string SearchText, string UserName)
        {
            var dt = GetRawItemsDeletedExportData(categoryId, SearchText);
            var filePath = GetExportFilePath(dt, UserName, "RawItemsDisabled");

            return filePath;
        }

        private string GetExportFilePath(DataTable dt, string UserName, string TemplateName)
        {
            //ExportTemplateBase exportTemplateBase = new ExportTemplateBase
            //{
            //    Name = "RawItems",
            //    TemplateName = TemplateName,
            //    UserName = UserName
            //};
            //var filePath = _exportManager.Export(exportTemplateBase, ExportFormat.Excel, dt);
            //return filePath;
            return "";
        }

        public DataTable GetRawItemsBySupplierId(int SupplierId)
        {
            var results = (from supplier in Context.ItemSuppliers
                           join item in Context.RawItems on supplier.ItemId equals item.RawItemId
                           join unit in Context.Units on item.MainUnitId equals unit.UnitId
                           where supplier.SupplierId == SupplierId
                           select new
                           {
                               RawItemId = item.RawItemId,
                               NameEn = item.NameEn,
                               NameAr = item.NameAr,
                               Cost = item.Cost,
                               UnitNameAr = unit.UnitNameAr,
                               UnitNameEn = unit.UnitNameEn,
                               UnitId = unit.UnitId
                           }).ToList();

            DataTable dt = results.ToDataTable();
            return dt;
        }

        public ActionsResponseModel AddUnit(Unit model)
        {
            try
            {
                Context.Add(new Unit
                {
                    UnitNameAr = model.UnitNameAr,
                    UnitNameEn = model.UnitNameEn
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
                Item.UnitNameAr = model.UnitNameAr;
                Item.UnitNameEn = model.UnitNameEn;

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
        public ActionsResponseModel ChangeItemStatus(int RawItemId)
        {
            try
            {
                var item = Context.RawItems.Where(a => a.RawItemId == RawItemId).FirstOrDefault();

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
