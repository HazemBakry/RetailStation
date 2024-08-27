using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Common.Export;
using MasterErp.Entities.DTOs.Inventory;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.Inventory;
using MasterErp.Service.Common;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;

namespace MasterErp.Service.Inventory
{
    public class ItemsService : IItemsService
    {

        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly ISharedFilterService SharedFilterService;
        private readonly string ConnectionString;
        private readonly IExportService ExportService;

        public ItemsService(DBContext Context, ISQLHelper SQLHelper, 
            IConfiguration Configuration, IExportService ExportService, 
            ISharedFilterService sharedFilterService)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.Configuration = Configuration;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
            this.ExportService = ExportService;
            SharedFilterService = sharedFilterService;
        }

        #region Items
        public List<ItemDto> GetItemsData(SearchFilterModel model, int? ItemId = null)
        {
            DataTable dt = SharedFilterService.MapFilterModelToDataTable(model.FilterModel.FilterItems);

            SqlParameter[] Params = new SqlParameter[4];

            Params[0] = new SqlParameter("@ItemId", (object)ItemId ?? DBNull.Value);
            Params[1] = new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value);
            Params[2] = new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value);
            Params[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[3].Value = dt;

            var result = SQLHelper.SQLQuery<ItemDto>("[Inventory].[SP_GetItemsData]", ConnectionString, Params);
            return result;

            //var query = from item in Context.Items.AsNoTracking()
            //            join unit in Context.Units on item.UnitId equals unit.UnitId
            //            join purchaseUnit in Context.Units on item.PurchaseUnitId equals purchaseUnit.UnitId into jT2
            //            from purchaseUnit in jT2.DefaultIfEmpty()
            //            join itemCategory in Context.ItemCategories on item.ItemCategoryId equals itemCategory.ItemCategoryId into jT3
            //            from itemCategory in jT3.DefaultIfEmpty()
            //            where (!ItemId.HasValue || item.ItemId == ItemId) && (CategoryId == 0 || item.ItemCategoryId == CategoryId)
            //            select new ItemDto
            //            {
            //                ItemId = item.ItemId,
            //                NameEN = item.NameEN,
            //                NameAR = item.NameAR,
            //                Cost = item.Cost,
            //                UnitId = item.UnitId,
            //                UnitName = unit.NameAR,
            //                PurchaseUnitId = item.PurchaseUnitId,
            //                PurchaseUnitName = purchaseUnit.NameAR,
            //                ItemCategoryId = item.ItemCategoryId,
            //                ItemCategoryName = itemCategory.NameAR,
            //                PurchasePrice = item.PurchasePrice,
            //                Yield = item.Yield,
            //                ConvertRatio = item.ConvertRatio,
            //                ItemType = item.ItemType,
            //                IsActive = item.IsActive,
            //                CreatedBy = item.CreatedBy,
            //                CreatedDate = item.CreatedDate,
            //                ModifiedBy = item.ModifiedBy,
            //                ModifiedDate = item.ModifiedDate,
            //                SupplierIds = item.ItemSuppliers.Select(x => x.SupplierId).ToList()
            //            };

            //int totalCount = query.Count();
            //if (FilterModel.CurrentPage > 0 && FilterModel.PageSize > 0)
            //{
            //    int skip = (FilterModel.CurrentPage - 1) * FilterModel.PageSize;
            //    query = query.Skip(skip).Take(FilterModel.PageSize);
            //}

            //var results = query.ToList();

            //var ItemSuppliers = (from item in results
            //                     join itemSupplier in Context.ItemSuppliers on item.ItemId equals itemSupplier.ItemId
            //                     select new ItemSupplier
            //                     {
            //                         ItemId = itemSupplier.ItemId,
            //                         SupplierId = itemSupplier.SupplierId
            //                     }).ToList();
            //foreach (var item in results)
            //{
            //    item.SupplierIds = ItemSuppliers.Where(x => x.ItemId == item.ItemId).Select(x => x.SupplierId).ToList();
            //    item.TotalCount = totalCount;
            //}
            ////results.ForEach(x => x.TotalCount = totalCount);
            //return results;
        }
        public ItemDto GetItemDetailsById(int ItemId)
        {
            return GetItemsData(new SearchFilterModel { PageSize=25,CurrentPage=1}, ItemId).FirstOrDefault();
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
                    ItemTypeId = model.ItemTypeId,
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
        public ActionsResponseModel EditItem(int ItemId, ItemDto model)
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
                    item.ItemTypeId = model.ItemTypeId;
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
        public ActionsResponseModel ExportItems(int categoryId, string UserName, SearchFilterModel SearchModel)
        {
            string url = string.Empty;
            try
            {
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 990000;
                var Data = GetItemsData(SearchModel);

                var result = Data.Select(res =>
                                new ItemDtoExportModel
                                {
                                    NameEN = res.NameEN,
                                    NameAR = res.NameAR,
                                    Cost = res.Cost,
                                    UnitName = res.UnitName,
                                    PurchaseUnitName = res.PurchaseUnitName,
                                    ItemCategoryName = res.ItemCategoryName,
                                    //CreatedDate = res.CreatedDate?.ToString("MM/dd/yyyy"),

                                }).ToList();

                if (!result.Any())
                {
                    result.Add(new ItemDtoExportModel());

                }


                var dtExport = DalHelper.ConvertToDataTable(result, "Items");


                url = GetExportFilePath(dtExport, UserName, "Items");


                return new ActionsResponseModel
                {
                    IsSuccess = true,
                    URL = url,
                    Message = "File Exported successfully"
                };

            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Status = 0,
                    URL = "",
                    Message = ex.InnerException?.Message ?? ex.Message,
                };
            }
        }
        public List<ItemDto> GetItemsBySupplierId(int SupplierId)
        {
            var results = (from item in Context.Items.AsNoTracking()
                           join unit in Context.Units on item.UnitId equals unit.UnitId
                           join supplier in Context.ItemSuppliers on item.ItemId equals supplier.ItemId
                           join purchaseUnit in Context.Units on item.PurchaseUnitId equals purchaseUnit.UnitId into jT2
                           from purchaseUnit in jT2.DefaultIfEmpty()
                           join itemCategory in Context.ItemCategories on item.ItemCategoryId equals itemCategory.ItemCategoryId into jT3
                           from itemCategory in jT3.DefaultIfEmpty()
                           where supplier.SupplierId == SupplierId
                           select new ItemDto
                           {
                               ItemId = item.ItemId,
                               NameEN = item.NameEN,
                               NameAR = item.NameAR,
                               Cost = item.Cost,
                               UnitId = item.UnitId,
                               UnitName = unit.NameAR,
                               PurchaseUnitId = item.PurchaseUnitId,
                               PurchaseUnitName = purchaseUnit.NameAR,
                               ItemCategoryId = item.ItemCategoryId,
                               ItemCategoryName = itemCategory.NameAR,
                               PurchasePrice = item.PurchasePrice,
                               Yield = item.Yield,
                               ConvertRatio = item.ConvertRatio,
                               ItemTypeId = item.ItemTypeId,
                               IsActive = item.IsActive,
                               CreatedBy = item.CreatedBy,
                               CreatedDate = item.CreatedDate,
                               ModifiedBy = item.ModifiedBy,
                               ModifiedDate = item.ModifiedDate,
                               SupplierIds = item.ItemSuppliers.Select(x => x.SupplierId).ToList()
                           }).ToList();

            return results;
        }
        public DataTable GetItemsBySupplierIdV2(int SupplierId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@SupplierId", SupplierId);

            var result = SQLHelper.ExecuteDataTable("[dbo].[SP_GetItemsBySupplierId]", ConnectionString, param);
            return result;
        }
        public List<OrderProductModel> GetItemsByLookupId(int LookupId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@LookupId", LookupId);

            var result = SQLHelper.SQLQuery<OrderProductModel>("[dbo].[SP_GetItemsByLookupId]", ConnectionString, param);
            return result;
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
        public List<ItemLookups> GetItemsLookups()
        {
            return Context.ItemLookups.ToList();
        }
        public List<ItemDto> GetItemsDeleted(int RawCategoryId, string SearchText)
        {
            SqlParameter[] Params = new SqlParameter[2];

            string SearchParam = SearchText == "undefined" || SearchText == "null" ? null : SearchText;
            Params[0] = new SqlParameter("@RawCategoryID", (object)RawCategoryId ?? DBNull.Value);
            Params[1] = new SqlParameter("@SearchText", (object)SearchParam ?? DBNull.Value);

            var results = SQLHelper.SQLQuery<ItemDto>("[dbo].[SP_GetItemsDeleted]", ConnectionString, Params);
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
            ExportTemplateBase exportTemplateBase = new ExportTemplateBase
            {
                Name = TemplateName,
                TemplateName = TemplateName,
                ReportName = TemplateName,
                CustomerName = "",
                Username = UserName,
                ExcelStyle = ExcelExportStyle.reportStyle,
                SheetName = "Data",
            };
            var filePath = ExportService.Export(exportTemplateBase, dt);
            return filePath;

        }
        #endregion

        #region Item Categories

        public List<ItemCategoryModel> GetItemCategories(int? CategoryId = null)
        {
            var result = (from cat in Context.ItemCategories
                          join op in Context.AccountTrees on cat.OperationAccountId equals op.AccountId
                          join ma in Context.AccountTrees on cat.ManagementAccountId equals ma.AccountId
                          select new ItemCategoryModel
                          {
                              ItemCategoryId = cat.ItemCategoryId,
                              NameAR = cat.NameAR,
                              NameEN = cat.NameEN,
                              OperationAccountId = cat.OperationAccountId,
                              OperationAccountName = op.NameAR,
                              DisplayOrder = cat.DisplayOrder,
                              ManagementAccountId = cat.ManagementAccountId,
                              ManagementAccountName = ma.NameAR,
                              Description = cat.Description,
                              IsActive = cat.IsActive,
                              CreatedBy = cat.CreatedBy,
                              CreatedDate = cat.CreatedDate,
                              ModifiedBy = cat.ModifiedBy,
                              ModifiedDate = cat.ModifiedDate,
                          }).OrderBy(c => c.DisplayOrder).ToList();

            //int totalCount = query.Count();

            //var results = query.ToList();
            //results.ForEach(x => x.TotalCount = totalCount);

            return result;
        }
        public ItemCategoryModel GetItemCategoryDetails(int CategoryId)
        {
            return GetItemCategories(CategoryId).FirstOrDefault();

        }

        public ActionsResponseModel AddNewItemCategory(ItemCategoryModel model)
        {
            try
            {
                ItemCategory Item = new ItemCategory
                {
                    NameEN = model.NameEN,
                    NameAR = model.NameAR,
                    OperationAccountId = model.OperationAccountId,
                    ManagementAccountId = model.ManagementAccountId,
                    Description = model.Description,
                    IsActive = model.IsActive,
                    DisplayOrder = model.DisplayOrder,
                    CreatedBy = string.Empty,
                    CreatedDate = DateTime.Now,
                };

                Context.ItemCategories.Add(Item);
                Context.SaveChanges();


                return new ActionsResponseModel { Message = "Category Added Successfly !" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public ActionsResponseModel EditItemCategory(int CategoryId, ItemCategoryModel model)
        {
            try
            {
                var itemCategory = Context.ItemCategories.Where(i => i.ItemCategoryId == CategoryId).FirstOrDefault();
                if (itemCategory != null)
                {
                    itemCategory.NameEN = model.NameEN;
                    itemCategory.NameAR = model.NameAR;
                    itemCategory.OperationAccountId = model.OperationAccountId;
                    itemCategory.ManagementAccountId = model.ManagementAccountId;
                    itemCategory.Description = model.Description;
                    itemCategory.IsActive = model.IsActive;
                    itemCategory.DisplayOrder = model.DisplayOrder;
                    itemCategory.ModifiedBy = "";
                    itemCategory.ModifiedDate = DateTime.Now;
                    Context.SaveChanges();

                    return new ActionsResponseModel { Message = "Item Category Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "can't find this item category" };
            }
            catch (Exception ex)
            {

                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };

            };
        }

        public ActionsResponseModel DeleteItemCategory(int CategoryId)
        {
            try
            {
                var itemCategory = Context.ItemCategories.FirstOrDefault(m => m.ItemCategoryId == CategoryId);
                if (itemCategory != null)
                {
                    Context.Remove(itemCategory);
                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Item Category Deleted Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "can't find this item category" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public ActionsResponseModel ChangeItemCategoryActiveStatus(int CategoryId)
        {
            try
            {
                var itemCategory = Context.ItemCategories.FirstOrDefault(m => m.ItemCategoryId == CategoryId);
                if (itemCategory != null)
                {
                    itemCategory.IsActive = !itemCategory.IsActive;
                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Active status changed Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "can't find this item category" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }

        public ActionsResponseModel ChangeCategoriesDisplayOrder(List<CategorySortModel> Categories)
        {

            try
            {
                var itemsToUpdate = (from category in Categories
                                     join itemCategory in Context.ItemCategories
                                     on category.CategoryId equals itemCategory.ItemCategoryId
                                     select itemCategory).ToList();

                foreach (var itemCategory in itemsToUpdate)
                {
                    var updatedCategory = Categories.FirstOrDefault(c => c.CategoryId == itemCategory.ItemCategoryId);
                    if (updatedCategory != null)
                    {
                        itemCategory.DisplayOrder = updatedCategory.DisplayOrder;
                    }
                }

                Context.SaveChanges();

                return new ActionsResponseModel { Message = "Categories display order updated successfully." };
            }
            catch (Exception ex)
            {

                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };

            };
        }

        public ActionsResponseModel ExportCategories(int categoryId, string UserName, SearchFilterModel Model)
        {
            throw new NotImplementedException();
        }
        #endregion

        #region Units

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
        public List<Unit> GetUnits()
        {
            var results = Context.Units.ToList();
            return results;
        }

        #endregion
    }
}
