using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Common.Inventory.ReceiveOrder;
using MasterErp.Entities.DTOs.Inventory;
using MasterErp.Entities.DTOs.Purchases;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.Inventory;
using MasterErp.Service.Common;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.Inventory
{
    public class ItemsService : IItemsService
    {

        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly string ConnectionString;

        public ItemsService(DBContext Context, ISQLHelper SQLHelper, IConfiguration Configuration)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.Configuration = Configuration;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
        }

        #region Items

        public List<ItemDto> GetItems(int CategoryId, SearchFilterModel SearchModel, int? ItemId = null)
        {
            var query = from item in Context.Items.AsNoTracking()
                        join unit in Context.Units on item.UnitId equals unit.UnitId 
                        join purchaseUnit in Context.Units on item.PurchaseUnitId equals purchaseUnit.UnitId into jT2
                        from purchaseUnit in jT2.DefaultIfEmpty()
                        join itemCategory in Context.ItemCategories on item.ItemCategoryId equals itemCategory.ItemCategoryId into jT3
                        from itemCategory in jT3.DefaultIfEmpty()
                        where (!ItemId.HasValue || item.ItemId == ItemId) && (CategoryId == 0 || item.ItemCategoryId == CategoryId)
                        select new ItemDto
                        {
                            ItemId = item.ItemId,
                            NameEN = item.NameEN,
                            NameAR = item.NameAR,
                            Cost = item.Cost,
                            UnitId = item.UnitId,
                            UnitName=unit.NameAR,
                            PurchaseUnitId = item.PurchaseUnitId,
                            PurchaseUnitName=purchaseUnit.NameAR,
                            ItemCategoryId = item.ItemCategoryId,
                            ItemCategoryName=itemCategory.NameAR,
                            PurchasePrice=item.PurchasePrice,
                            Yield=item.Yield,
                            ConvertRatio=item.ConvertRatio,
                            ItemType=item.ItemType,
                            IsActive = item.IsActive,
                            CreatedBy = item.CreatedBy,
                            CreatedDate = item.CreatedDate,
                            ModifiedBy = item.ModifiedBy,
                            ModifiedDate = item.ModifiedDate,
                            SupplierIds=item.ItemSuppliers.Select(x => x.SupplierId).ToList()
                        };

            int totalCount = query.Count();
            if (SearchModel.CurrentPage > 0 && SearchModel.PageSize > 0)
            {
                int skip = (SearchModel.CurrentPage - 1) * SearchModel.PageSize;
                query = query.Skip(skip).Take(SearchModel.PageSize);
            }

            var results = query.ToList();

            var ItemSuppliers = (from item in results
                      join itemSupplier in Context.ItemSuppliers on item.ItemId equals itemSupplier.ItemId 
                      select new ItemSupplier
                      {
                          ItemId = itemSupplier.ItemId,
                          SupplierId = itemSupplier.SupplierId
                      }).ToList();
            foreach (var item in results)
            {
                item.SupplierIds = ItemSuppliers.Where(x => x.ItemId == item.ItemId).Select(x => x.SupplierId).ToList();
                item.TotalCount = totalCount;
            }
            //results.ForEach(x => x.TotalCount = totalCount);
            return results;
        }
        public ItemDto GetItemById(int ItemId)
        {

            return GetItems(0, new SearchFilterModel(), ItemId).FirstOrDefault();
        }

        public ActionsResponseModel AddNewItem(ItemDto model)
        {
            try
            {
                Item Item = new Item
                {
                    NameEN = model.NameEN,
                    NameAR = model.NameAR,
                    Cost = model.Cost,
                    UnitId = model.UnitId,
                    PurchaseUnitId = model.PurchaseUnitId,
                    ItemCategoryId = model.ItemCategoryId,
                    PurchasePrice = model.PurchasePrice,
                    Yield = model.Yield,
                    ConvertRatio = model.ConvertRatio,
                    ItemType = model.ItemType,
                    IsActive = model.IsActive,
                    CreatedBy = model.CreatedBy,
                    CreatedDate = model.CreatedDate
                };

                Context.Items.Add(Item);
                Context.SaveChanges();

                foreach (var supplierId in model.SupplierIds)
                {
                    Context.ItemSuppliers.Add(new ItemSupplier
                    {
                        ItemId = Item.ItemId,
                        SupplierId = supplierId
                    });

                    Context.SaveChanges();
                }

                return new ActionsResponseModel { Message = "Item Added Successfly !" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public ActionsResponseModel EditItem(int ItemId,ItemDto model)
        {

            try
            {
                var item = Context.Items.Where(i => i.ItemId == ItemId).FirstOrDefault();
                if (item != null)
                {
                    item.NameEN = model.NameEN;
                    item.NameAR = model.NameAR;
                    item.Cost = model.Cost;
                    item.UnitId = model.UnitId;
                    item.PurchaseUnitId = model.PurchaseUnitId;
                    item.ItemCategoryId = model.ItemCategoryId;
                    item.PurchasePrice = model.PurchasePrice;
                    item.Yield = model.Yield;
                    item.ConvertRatio = model.ConvertRatio;
                    item.ItemType = model.ItemType;
                    item.IsActive = model.IsActive;
                    item.ModifiedBy = model.ModifiedBy;
                    item.ModifiedDate = DateTime.Now;
                    Context.SaveChanges();

                    var ItemsSupplier = Context.ItemSuppliers.Where(x => x.ItemId == ItemId).ToList();
                    Context.ItemSuppliers.RemoveRange(ItemsSupplier);
                    Context.SaveChanges();

                    foreach (var supplierId in model.SupplierIds)
                    {
                        Context.ItemSuppliers.Add(new ItemSupplier
                        {
                            ItemId = ItemId,
                            SupplierId = supplierId
                        });

                        Context.SaveChanges();
                    }

                    return new ActionsResponseModel { Message = "Item Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "can't find this item" };
            }
            catch (Exception ex)
            {

                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };

            }
        }

        public ActionsResponseModel DeleteItem(int ItemId)
        {
            try
            {
                var item = Context.Items.FirstOrDefault(m => m.ItemId == ItemId);
                if (item != null)
                {
                    Context.Remove(item);
                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Item Deleted Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "can't find this item" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }
        public string ExportItems(int categoryId, string UserName, SearchFilterModel Model)
        {
            //var dt = GetAllItemsExportData(categoryId, SearchText);
            //var filePath = GetExportFilePath(dt, UserName, "ItemsDisabled");

            //return filePath;
            return string.Empty;
        }

        #endregion

        public List<ItemLookups> GetItemsLookups()
        {
            return Context.ItemLookups.ToList();
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
