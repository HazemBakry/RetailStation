using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Enums;
using RetailStation.Entities.Common.Export;
using RetailStation.Entities.DTOs.Inventory;
using RetailStation.Entities.Models;
using RetailStation.Interface.Common;
using RetailStation.Service.Common;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using RetailStation.Interface.Operation;
using RetailStation.Entities.Models.Operation;
using RetailStation.Entities.DTOs.Operation;

namespace RetailStation.Service.Operation
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
            DataTable dt = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] Params = new SqlParameter[4];

            Params[0] = new SqlParameter("@ItemId", (object)ItemId ?? DBNull.Value);
            Params[1] = new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value);
            Params[2] = new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value);
            Params[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[3].Value = dt;

            var result = SQLHelper.SQLQuery<ItemDto>("[Operation].[SP_GetItemsData]", ConnectionString, Params);
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
            return GetItemsData(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, ItemId).FirstOrDefault();
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

            var result = SQLHelper.ExecuteDataTable("[dbo].[SP_GetItemsBySupplierId]", param, ConnectionString);
            return result;
        }

        public ActionsResponseModel ChangeItemActiveStatus(int ItemId)
        {
            try
            {
                var item = Context.Items.Where(a => a.ItemId == ItemId).FirstOrDefault();

                item.IsActive = !item.IsActive;
                Context.SaveChanges();

                return new ActionsResponseModel
                {
                    Message = "تم حفظ تغير الحاله بنجاح"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = ex.InnerException?.Message ?? ex.Message
                };
            }
        }
        public ActionsResponseModel ItemQuickUpdate(int ItemId, decimal Price, int UnitId)
        {
            try
            {
                var item = Context.Items.Where(a => a.ItemId == ItemId).FirstOrDefault();

                item.Cost = Price;
                item.UnitId = UnitId;
                Context.SaveChanges();

                return new ActionsResponseModel
                {
                    Message = "تم حفظ تعديل الصنف بنجاح"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = ex.InnerException?.Message ?? ex.Message
                };
            }
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

            return SQLHelper.ExecuteDataTable("[dbo].[SP_GetAllItemsExportData]", Params, ConnectionString);
        }
        public DataTable GetItemsDeletedExportData(int categoryId, string SearchText)
        {
            SqlParameter[] Params = new SqlParameter[2];
            string SearchParam = SearchText == "undefined" || SearchText == "null" ? null : SearchText;
            Params[0] = new SqlParameter("@ItemCategoryID", (object)categoryId ?? DBNull.Value);
            Params[1] = new SqlParameter("@SearchText", (object)SearchParam ?? DBNull.Value);

            return SQLHelper.ExecuteDataTable("[dbo].[SP_GetItemsDeletedExportData]", Params, ConnectionString);
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
                          join parentGroup in Context.ItemCategories on cat.ParentCategoryId equals parentGroup.ItemCategoryId into jT2
                          from parentGroup in jT2.DefaultIfEmpty()
                          select new ItemCategoryModel
                          {
                              ItemCategoryId = cat.ItemCategoryId,
                              NameAR = cat.NameAR,
                              NameEN = cat.NameEN,
                              DisplayOrder = cat.DisplayOrder,
                              Description = cat.Description,
                              IsActive = cat.IsActive,
                              IsDeleted = cat.IsDeleted,
                              CreatedBy = cat.CreatedBy,
                              CreatedDate = cat.CreatedDate,
                              ModifiedBy = cat.ModifiedBy,
                              ModifiedDate = cat.ModifiedDate,
                              IsGroup = cat.IsGroup,
                              ParentCategoryId = cat.ParentCategoryId,
                              ParentCategoryNameAR = parentGroup.NameAR,
                              ParentCategoryNameEN = parentGroup.NameEN
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
                    Description = model.Description,
                    IsActive = model.IsActive,
                    DisplayOrder = model.DisplayOrder,
                    ParentCategoryId = model.ParentCategoryId,
                    IsGroup = model.ParentCategoryId != null ? true : false,
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
                    itemCategory.Description = model.Description;
                    itemCategory.IsActive = model.IsActive;
                    itemCategory.DisplayOrder = model.DisplayOrder;
                    itemCategory.ParentCategoryId = model.ParentCategoryId;
                    itemCategory.IsGroup = model.ParentCategoryId != null ? true : false;
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

        public ActionsResponseModel AddUnit(UnitModel model)
        {
            try
            {
                if(Context.Units.Any(x=>x.NameEN==model.NameEN || x.NameAR == model.NameAR || x.Code == model.Code))
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "هذة الوحدة موجوده من قبل !"
                    };
                Context.Add(new Unit
                {
                    NameAR = model.NameAR,
                    NameEN = model.NameEN,
                    Code = model.Code,
                    IsActive = model.IsActive,
                    Description = model.Description,
                    CreatedBy = string.Empty,
                    CreatedDate = DateTime.Now,
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
                    IsSuccess = false,
                    Message = ex.InnerException?.Message ?? ex.Message
                };
            }
        }
        public ActionsResponseModel EditUnit(int UnitId,UnitModel model)
        {
            var Item = Context.Units.Where(x => x.UnitId == UnitId).FirstOrDefault();

            if (Item != null)
            {
                Item.NameAR = model.NameAR;
                Item.NameEN = model.NameEN;
                Item.Code = model.Code;
                Item.Description = model.Description;
                Item.IsActive = model.IsActive;
                Item.ModifiedBy = string.Empty;

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
                    IsSuccess = false,
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
                    IsSuccess = false,
                    Message = "يرجى اختبار الوحدة المراد حذفها"
                };
            }
        }
        public List<UnitModel> GetUnits_Data(SearchFilterModel FilterModel)
        {


            var query = from unit in Context.Units 
                        select new UnitModel
                        {
                            NameEN = unit.NameEN,
                            NameAR = unit.NameAR,
                            UnitId = unit.UnitId,
                            Description = unit.Description,
                            Code = unit.Code,
                            IsDeleted = unit.IsDeleted,
                            IsActive = unit.IsActive,
                            CreatedBy = unit.CreatedBy,
                            CreatedDate = unit.CreatedDate,
                            ModifiedBy = unit.ModifiedBy,
                            ModifiedDate = unit.ModifiedDate,
                        };

            int totalCount = query.Count();
            if (FilterModel.CurrentPage > 0 && FilterModel.PageSize > 0)
            {
                int skip = (FilterModel.CurrentPage - 1) * FilterModel.PageSize;
                query = query.Skip(skip).Take(FilterModel.PageSize);
            }

            var results = query.ToList();
            results.ForEach(x => x.TotalCount = totalCount);
            return results;
        }

        #endregion

        #region ItemLookups
        public List<ItemLookupModel> GetItemLookups_Data(SearchFilterModel model, int? ItemLookupId = null)
        {
            DataTable dt = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] Params = new SqlParameter[4];
            Params[0] = new SqlParameter("@ItemLookupId", ItemLookupId);
            Params[1] = new SqlParameter("@CurrentPage", model.CurrentPage);
            Params[2] = new SqlParameter("@PageSize", model.PageSize);
            Params[3] = new SqlParameter("@FilterList", SqlDbType.Structured) { Value = dt };

            var results = SQLHelper.SQLQuery<ItemLookupDetailsModel>("[Inventory].[SP_GetItemLookups_Data]", ConnectionString, Params);

            var groupedData = results.GroupBy(x => x.ItemLookupId).Select(x =>
            {
                var item = x.FirstOrDefault();
                return new ItemLookupModel
                {
                    ItemLookupId = x.Key,
                    NameAR = item?.NameAR,
                    NameEN = item?.NameEN,
                    BranchId = item?.BranchId,
                    Notes = item?.Notes,
                    TotalCount = item?.TotalCount,
                    Items = x.Where(x => x.ItemLookupDetailsId != null && x.ItemId != null).ToList(),
                };
            }).ToList();
            return groupedData;
        }
        public ItemLookupModel GetItemLookupDetailsById(int ItemLookupId)
        {
            return GetItemLookups_Data(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, ItemLookupId)?.FirstOrDefault();

        }
        public ActionsResponseModel CreateNewItemLookup(ItemLookupModel model)
        {
            try
            {
                var lookup = new ItemLookups
                {
                    NameAR = model.NameAR,
                    NameEN = model.NameEN,
                    BranchId = model.BranchId,
                    Notes = model.Notes,
                    CreatedBy = model.CreatedBy,
                    CreatedDate = DateTime.Now
                };

                Context.ItemLookups.Add(lookup);
                Context.SaveChanges();

                return new ActionsResponseModel
                {
                    Id = lookup.ItemLookupId,
                    Message = "تم إنشاء القالب بنجاح"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }


        public ActionsResponseModel EditItemLookup(int ItemLookupId, ItemLookupModel model)
        {
            try
            {
                var existing = Context.ItemLookups.FirstOrDefault(x => x.ItemLookupId == ItemLookupId);
                if (existing != null)
                {
                    existing.NameAR = model.NameAR;
                    existing.NameEN = model.NameEN;
                    existing.Notes = model.Notes;
                    existing.BranchId = model.BranchId;
                    existing.ModifiedBy = model.ModifiedBy;
                    existing.ModifiedDate = DateTime.Now;

                    Context.SaveChanges();

                    return new ActionsResponseModel { Message = "تم تعديل القالب بنجاح" };
                }

                return new ActionsResponseModel { IsSuccess = false, Message = "القالب غير موجودة" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.Message };
            }
        }


        public ActionsResponseModel DeleteItemLookup(int ItemLookupId)
        {
            try
            {
                var item = Context.ItemLookups.FirstOrDefault(x => x.ItemLookupId == ItemLookupId);
                if (item != null)
                {
                    Context.ItemLookups.Remove(item);
                    var details = Context.ItemLookupDetails.Where(x => x.ItemLookupId == ItemLookupId);
                    if (details.Any())
                        Context.ItemLookupDetails.RemoveRange(details);

                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "تم حذف القالب بنجاح" };
                }

                return new ActionsResponseModel { IsSuccess = false, Message = "القالب غير موجودة" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public ActionsResponseModel AddItemsToLookup(int ItemLookupId, List<ItemLookupDetailsModel> model)
        {
            try
            {
                var existing = Context.ItemLookupDetails.Where(x => x.ItemLookupId == ItemLookupId).ToList();
                Context.ItemLookupDetails.RemoveRange(existing);
                Context.SaveChanges();

                foreach (var item in model)
                {
                    Context.ItemLookupDetails.Add(new ItemLookupDetails
                    {
                        ItemLookupId = ItemLookupId,
                        ItemId = item.ItemId,
                        DisplayOrder = item.DisplayOrder ?? 0,
                        Quantity = item.Quantity ?? 0
                    });
                }

                Context.SaveChanges();
                return new ActionsResponseModel { Message = "تم حفظ القالب" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.Message };
            }
        }

        public List<GeneralOrderDetailsModel> GetItemsByLookupId(int ItemLookupId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@ItemLookupId", ItemLookupId);

            var result = SQLHelper.SQLQuery<GeneralOrderDetailsModel>("[dbo].[SP_GetItemsByLookupId]", null, param);
            return result;
        }
        public List<ItemLookups> GetItemsLookups()
        {
            return Context.ItemLookups.ToList();
        }

        #endregion
    }
}
