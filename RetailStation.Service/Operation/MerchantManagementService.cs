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
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.IO;

namespace RetailStation.Service.Operation
{
    public class MerchantManagementService : IMerchantManagementService
    {
        private readonly DBContext Context;
        private readonly LookupsDbContext LookupsDbContext;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly ISharedFilterService SharedFilterService;
        private readonly string ConnectionString;
        private readonly IExportService ExportService;
        private readonly IFileService _fileService;
        private readonly IDataImportService _dataImportService;
        private const string ItemsImagesFolder = "ItemsImages";
        private const string BranchImagesFolder = "BranchImages";
        private readonly string PromotionImagesFolder = "PromotionsImages";

        public MerchantManagementService(DBContext Context, ISQLHelper SQLHelper,
            IConfiguration Configuration, IExportService ExportService,
            ISharedFilterService sharedFilterService, LookupsDbContext lookupsDbContext, IFileService fileService, IDataImportService dataImportService)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.Configuration = Configuration;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
            this.ExportService = ExportService;
            SharedFilterService = sharedFilterService;
            LookupsDbContext = lookupsDbContext;
            _fileService = fileService;
            //ItemsImagesFolder = "ItemsImages";
            _dataImportService = dataImportService;

        }

        public List<MerchantItemModel> GetMerchantItems_Data(int MerchantId, SearchFilterModel model, int? MerchantItemId = null)
        {
            DataTable dt = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] Params = new SqlParameter[]
            {
                new SqlParameter("@MerchantItemId", (object)MerchantItemId ?? DBNull.Value),
                new SqlParameter("@MerchantId", (object)MerchantId ?? DBNull.Value),
                new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value),
                new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value),
                new SqlParameter("@FilterList", SqlDbType.Structured) { Value = dt },
            };

            var result = SQLHelper.SQLQuery<MerchantItemModel>("[Operation].[SP_GetMerchantItems_Data]", ConnectionString, Params);
            foreach (var item in result.Where(x => !string.IsNullOrEmpty(x.ImageUrl)))
            {
                item.ImageUrl = _fileService.GetFileDownloadUrl(Path.Combine(ItemsImagesFolder, item.ImageUrl));
            }
            return result;
        }

        public List<FilterModel> GetMerchantItems_Filters(int MerchantId, SearchFilterModel PagingFilter)
        {
            var dt = SharedFilterService.MapFilterModelToDataTable(PagingFilter.FilterList);
            
            SqlParameter[] Params = new SqlParameter[]
            {
                new SqlParameter("@MerchantId", (object)MerchantId ?? DBNull.Value),
                new SqlParameter("@FilterList", SqlDbType.Structured) { Value = dt },
            };

            var results = SQLHelper.SQLQuery<FilterItem>("[Operation].[SP_GetMerchantItems_Filters]", ConnectionString, Params);
            return SharedFilterService.GroupedFilterItems(results);
        }

        public MerchantItemModel GetMerchantItemDetailsById(int MerchantId, int MerchantItemId)
        {
            return GetMerchantItems_Data(MerchantId, new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, MerchantItemId).FirstOrDefault();
        }
        public async Task<ActionsResponseModel> AddNewMerchantItem(int MerchantId, MerchantItemModel model)
        {
            try
            {
                MerchantItem Item = new MerchantItem
                {
                    MerchantId = MerchantId,
                    NameEN = model.NameEN,
                    NameAR = model.NameAR,
                    Price = (decimal)model.Price,
                    OfferPrice = (decimal)model.OfferPrice,
                    Quantity = (decimal)model.Quantity,
                    MinimumOrderQuantity = (decimal)model.MinimumOrderQuantity,
                    UnitId = model.UnitId,
                    ItemCategoryId = model.ItemCategoryId,
                    ItemTypeId = model.ItemTypeId,
                    IsActive = model.IsActive,
                    CreatedBy = model.CreatedBy,
                    CreatedDate = DateTime.Now
                };
                if (model.Image != null)
                {
                    var uploadResponse = await _fileService.UploadFileAsync(model.Image, ItemsImagesFolder, FileType.Image);
                    if (uploadResponse.IsUploaded)
                        Item.ImageUrl = uploadResponse.FilePath;
                    else
                        return new ActionsResponseModel { Message = uploadResponse.Message, IsSuccess = false };
                }
                Context.MerchantItems.Add(Item);
                Context.SaveChanges();
                return new ActionsResponseModel { Message = "Item Added Successful !" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }
        public async Task<ActionsResponseModel> EditMerchantItem(int MerchantId, int MerchantItemId, MerchantItemModel model)
        {

            try
            {
                var item = Context.MerchantItems.Where(i => i.MerchantItemId == MerchantItemId && i.MerchantId == MerchantId).FirstOrDefault();
                if (item != null)
                {
                    item.NameEN = model.NameEN;
                    item.NameAR = model.NameAR;
                    item.Price = (decimal)model.Price;
                    item.OfferPrice = (decimal)model.OfferPrice;
                    item.Price10 = (decimal)model.Price10;
                    item.Price100 = (decimal)model.Price100;
                    item.Price1000 = (decimal)model.Price1000;
                    item.Quantity = (decimal)model.Quantity;
                    item.MinimumOrderQuantity = (decimal)model.MinimumOrderQuantity;
                    item.UnitId = model.UnitId;
                    item.ItemCategoryId = model.ItemCategoryId;
                    item.ItemTypeId = model.ItemTypeId;
                    item.IsActive = model.IsActive;
                    item.ModifiedBy = model.ModifiedBy;
                    item.ModifiedDate = DateTime.Now;
                    if (model.Image != null)
                    {
                        var uploadResponse = await _fileService.UploadFileAsync(model.Image, ItemsImagesFolder, FileType.Image);
                        if (uploadResponse.IsUploaded)
                        {
                            item.ImageUrl = uploadResponse.FilePath;
                        }
                        else
                        {
                            return new ActionsResponseModel { Message = uploadResponse.Message, IsSuccess = false };
                        }

                    }
                    Context.SaveChanges();

                    return new ActionsResponseModel { Message = "Item Updated Successfully !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "can't find this item" };
            }
            catch (Exception ex)
            {

                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };

            }
        }
        public ActionsResponseModel DeleteMerchantItem(int MerchantId, int MerchantItemId)
        {
            try
            {
                var item = Context.MerchantItems.FirstOrDefault(m => m.MerchantItemId == MerchantItemId && m.MerchantId == MerchantId);
                if (item != null)
                {
                    Context.Remove(item);
                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Item Deleted Successfully !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "can't find this item" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public ActionsResponseModel ExportMerchantItem(int MerchantId, string UserName, SearchFilterModel SearchModel)
        {
            string url = string.Empty;
            try
            {
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 990000;
                var Data = GetMerchantItems_Data(MerchantId, SearchModel);

                var result = Data.Select(res =>
                                new MerchantItemExportModel
                                {
                                    NameEN = res.NameEN,
                                    NameAR = res.NameAR,
                                    Price = res.Price,
                                    UnitName = res.UnitName,
                                    PurchaseUnitName = res.PurchaseUnitName,
                                    ItemCategoryName = res.ItemCategoryName,
                                    //CreatedDate = res.CreatedDate?.ToString("MM/dd/yyyy"),

                                }).ToList();

                if (!result.Any())
                {
                    result.Add(new MerchantItemExportModel());

                }


                var dtExport = DalHelper.ConvertToDataTable(result, "Merchant Items");


                url = GetExportFilePath(dtExport, UserName, "Merchant Items");


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


        public ActionsResponseModel ChangeMerchantItemActiveStatus(int MerchantId, int MerchantItemId)
        {
            try
            {
                var item = Context.MerchantItems.Where(a => a.MerchantItemId == MerchantItemId && a.MerchantId == MerchantId).FirstOrDefault();

                item.IsActive = !item.IsActive;
                Context.SaveChanges();

                return new ActionsResponseModel
                {
                    Message = "Status changed successfully"
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

        public async Task<ActionsResponseModel> MapMerchantItem(int MerchantId, int MerchantItemId, int? ItemId)
        {
            try
            {
                var item = Context.MerchantItems.Where(i => i.MerchantItemId == MerchantItemId && i.MerchantId == MerchantId).FirstOrDefault();
                if (item != null)
                {
                    item.ItemId = ItemId;
                    await Context.SaveChangesAsync();
                    return new ActionsResponseModel { Message = "Item Updated Successfully !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "can't find this item" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }
        public async Task<ActionsResponseModel> MarkItemAsBestSeller(int MerchantItemId)
        {
            try
            {
                var item = Context.MerchantItems.Where(i => i.MerchantItemId == MerchantItemId).FirstOrDefault();
                if (item != null)
                {
                    //item.IsBestSellerItem = !item.IsBestSellerItem;
                    await Context.SaveChangesAsync();
                    return new ActionsResponseModel { Message = "Item Updated Successfully !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "can't find this item" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public async Task<ActionsResponseModel> ImportMerchantItemsFile(int MerchantId, string ImporterName, IFormFile file)
        {

            try
            {
                SqlParameter[] Params = new SqlParameter[]
                {
                    new SqlParameter("@MerchantId", MerchantId),
                };
                var response = await _dataImportService.ExecuteImporter(file, Params, "[Import].[SP_Import_MerchantItems]", ImporterName);
                return response;
            }
            catch (Exception ex)
            {

                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };

            }
        }


        public ActionsResponseModel ItemQuickUpdate(int MerchantId, int MerchantItemId, decimal Price, int UnitId)
        {
            try
            {
                var item = Context.MerchantItems.Where(a => a.MerchantItemId == MerchantItemId && a.MerchantId == MerchantId).FirstOrDefault();

                item.Price = Price;
                item.UnitId = UnitId;
                Context.SaveChanges();

                return new ActionsResponseModel
                {
                    Message = "Price changed successfully"
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




        #region Branch
        public List<BranchModel> GetBranches_Data(int merchantId, SearchFilterModel filter, int? branchId = null)
        {
            var query = Context.Branches.AsNoTracking()
              .Where(s => s.MerchantId == merchantId && (!branchId.HasValue || s.BranchId == branchId));

            int totalCount = query.Count();

            if (filter.CurrentPage > 0 && filter.PageSize > 0)
            {
                int skip = (filter.CurrentPage - 1) * filter.PageSize;
                query = query.Skip(skip).Take(filter.PageSize);
            }

            var results = query
              .Select(s => new BranchModel
              {
                  BranchId = s.BranchId,
                  NameAR = s.NameAR,
                  NameEN = s.NameEN,
                  Phone = s.Phone,
                  Address = s.Address,
                  RegionId = s.RegionId,
                  OpeningTimeFrom = s.OpeningTimeFrom,
                  OpeningTimeTo = s.OpeningTimeTo,
                  WorkingTimeAR = s.WorkingTimeAR,
                  WorkingTimeEN = s.WorkingTimeEN,
                  MerchantId = s.MerchantId,
                  ImageURL = s.ImageURL,
                  IsActive = s.IsActive,
                  CreatedBy = s.CreatedBy,
                  CreatedDate = s.CreatedDate,
                  ModifiedBy = s.ModifiedBy,
                  ModifiedDate = s.ModifiedDate
              })
              .ToList();

            foreach (var item in results.Where(x => !string.IsNullOrEmpty(x.ImageURL)))
            {
                item.ImageURL = _fileService.GetFileDownloadUrl(Path.Combine(BranchImagesFolder, item.ImageURL));
            }

            results.ForEach(x => x.TotalCount = totalCount);
            return results;
        }

        public BranchModel GetBranchById(int merchantId, int branchId)
        {
            return GetBranches_Data(merchantId, new SearchFilterModel { PageSize = 1, CurrentPage = 1 }, branchId).FirstOrDefault();
        }

        public async Task<ActionsResponseModel> AddBranch(int merchantId, BranchModel model)
        {
            try
            {
                var branch = new Branch
                {
                    NameAR = model.NameAR,
                    NameEN = model.NameEN,
                    Phone = model.Phone,
                    Address = model.Address,
                    RegionId = model.RegionId,
                    IsActive = model.IsActive,
                    OpeningTimeFrom = model.OpeningTimeFrom,
                    OpeningTimeTo = model.OpeningTimeTo,
                    WorkingTimeAR = model.WorkingTimeAR,
                    WorkingTimeEN = model.WorkingTimeEN,
                    MerchantId = merchantId,
                    CreatedBy = model.CreatedBy,
                    CreatedDate = DateTime.Now
                };

                if (model.Image != null)
                {
                    var upload = await _fileService.UploadFileAsync(model.Image, BranchImagesFolder, FileType.Image);
                    if (upload.IsUploaded)
                        branch.ImageURL = upload.FilePath;
                    else
                        return new ActionsResponseModel { IsSuccess = false, Message = upload.Message };
                }

                Context.Branches.Add(branch);
                Context.SaveChanges();
                return new ActionsResponseModel { Message = "Branch added successfully!" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public async Task<ActionsResponseModel> EditBranch(int merchantId, int branchId, BranchModel model)
        {
            try
            {
                var branch = Context.Branches.FirstOrDefault(s => s.BranchId == branchId && s.MerchantId == merchantId);
                if (branch == null)
                    return new ActionsResponseModel { IsSuccess = false, Message = "Branch not found." };

                branch.NameAR = model.NameAR;
                branch.NameEN = model.NameEN;
                branch.Phone = model.Phone;
                branch.Address = model.Address;
                branch.RegionId = model.RegionId;
                branch.IsActive = model.IsActive;
                branch.OpeningTimeFrom = model.OpeningTimeFrom;
                branch.OpeningTimeTo = model.OpeningTimeTo;
                branch.WorkingTimeAR = model.WorkingTimeAR;
                branch.WorkingTimeEN = model.WorkingTimeEN;
                branch.ModifiedBy = model.ModifiedBy;
                branch.ModifiedDate = DateTime.Now;

                if (model.Image != null)
                {
                    var upload = await _fileService.UploadFileAsync(model.Image, BranchImagesFolder, FileType.Image);
                    if (upload.IsUploaded)
                        branch.ImageURL = upload.FilePath;
                    else
                        return new ActionsResponseModel { IsSuccess = false, Message = upload.Message };
                }

                Context.SaveChanges();
                return new ActionsResponseModel { Message = "Branch updated successfully!" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public ActionsResponseModel DeleteBranch(int merchantId, int branchId)
        {
            try
            {
                var branch = Context.Branches.FirstOrDefault(s => s.BranchId == branchId && s.MerchantId == merchantId);
                if (branch == null)
                    return new ActionsResponseModel { IsSuccess = false, Message = "Branch not found." };

                Context.Branches.Remove(branch);
                Context.SaveChanges();

                return new ActionsResponseModel { Message = "Branch deleted successfully!" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public ActionsResponseModel ChangeBranchActiveStatus(int merchantId, int branchId)
        {
            try
            {
                var branch = Context.Branches.FirstOrDefault(s => s.BranchId == branchId && s.MerchantId == merchantId);
                if (branch == null)
                    return new ActionsResponseModel { IsSuccess = false, Message = "Branch not found." };

                branch.IsActive = !branch.IsActive;
                branch.ModifiedDate = DateTime.Now;
                Context.SaveChanges();

                return new ActionsResponseModel { Message = "Branch status changed successfully!" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }
        #endregion



        #region Promotions

        public List<PromotionModel> GetPromotionsData(int merchantId, SearchFilterModel filter, int? promotionId = null)
        {
            var query = Context.Promotions.AsNoTracking()
                .Where(p => p.MerchantId == merchantId && (!promotionId.HasValue || p.PromotionId == promotionId));

            int totalCount = query.Count();

            if (filter.CurrentPage > 0 && filter.PageSize > 0)
            {
                int skip = (filter.CurrentPage - 1) * filter.PageSize;
                query = query.Skip(skip).Take(filter.PageSize);
            }

            var results = query
                .Select(p => new PromotionModel
                {
                    PromotionId = p.PromotionId,
                    MerchantItemId = p.MerchantItemId,
                    Title = p.Title,
                    Description = p.Description,
                    ImageURL = p.Image,
                    OfferPrice = p.OfferPrice,
                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                    MinQty = p.MinQty,
                    MaxQty = p.MaxQty,
                    IsActive = p.IsActive,
                    CreatedBy = p.CreatedBy,
                    CreatedDate = p.CreatedDate,
                    ModifiedBy = p.ModifiedBy,
                    ModifiedDate = p.ModifiedDate
                })
                .ToList();

            foreach (var item in results.Where(x => !string.IsNullOrEmpty(x.ImageURL)))
            {
                item.ImageURL = _fileService.GetFileDownloadUrl(Path.Combine(PromotionImagesFolder, item.ImageURL));
            }

            results.ForEach(x => x.TotalCount = totalCount);
            return results;
        }


        public PromotionModel GetPromotionById(int merchantId, int promotionId)
        {
            return GetPromotionsData(merchantId, new SearchFilterModel { PageSize = 1, CurrentPage = 1 }, promotionId).FirstOrDefault();
        }

        public async Task<ActionsResponseModel> AddPromotion(int merchantId, PromotionModel model)
        {
            try
            {
                var promotion = new Promotion
                {
                    MerchantItemId = model.MerchantItemId.GetValueOrDefault(),
                    MerchantId = merchantId,
                    Title = model.Title,
                    Description = model.Description,
                    OfferPrice = model.OfferPrice,
                    StartDate = model.StartDate,
                    EndDate = model.EndDate,
                    MinQty = model.MinQty,
                    MaxQty = model.MaxQty,
                    IsActive = model.IsActive,
                    CreatedBy = model.CreatedBy,
                    CreatedDate = DateTime.Now
                };

                if (model.Image != null)
                {
                    var upload = await _fileService.UploadFileAsync(model.Image, PromotionImagesFolder, FileType.Image);
                    if (upload.IsUploaded)
                        promotion.Image = upload.FilePath;
                    else
                        return new ActionsResponseModel { IsSuccess = false, Message = upload.Message };
                }

                Context.Promotions.Add(promotion);
                Context.SaveChanges();
                return new ActionsResponseModel { Message = "Promotion added successfully!" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public async Task<ActionsResponseModel> EditPromotion(int merchantId, int promotionId, PromotionModel model)
        {
            try
            {
                var promotion = Context.Promotions.FirstOrDefault(p => p.MerchantId == merchantId && p.PromotionId == promotionId);
                if (promotion == null)
                    return new ActionsResponseModel { IsSuccess = false, Message = "Promotion not found." };

                promotion.MerchantItemId = model.MerchantItemId.GetValueOrDefault();
                promotion.Title = model.Title;
                promotion.Description = model.Description;
                promotion.OfferPrice = model.OfferPrice;
                promotion.StartDate = model.StartDate;
                promotion.EndDate = model.EndDate;
                promotion.MinQty = model.MinQty;
                promotion.MaxQty = model.MaxQty;
                promotion.IsActive = model.IsActive;
                promotion.ModifiedBy = model.ModifiedBy;
                promotion.ModifiedDate = DateTime.Now;

                if (model.Image != null)
                {
                    var upload = await _fileService.UploadFileAsync(model.Image, PromotionImagesFolder, FileType.Image);
                    if (upload.IsUploaded)
                        promotion.Image = upload.FilePath;
                    else
                        return new ActionsResponseModel { IsSuccess = false, Message = upload.Message };
                }

                Context.SaveChanges();
                return new ActionsResponseModel { Message = "Promotion updated successfully!" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public ActionsResponseModel DeletePromotion(int merchantId, int promotionId)
        {
            try
            {
                var promotion = Context.Promotions.FirstOrDefault(p => p.MerchantId == merchantId && p.PromotionId == promotionId);
                if (promotion == null)
                    return new ActionsResponseModel { IsSuccess = false, Message = "Promotion not found." };

                Context.Promotions.Remove(promotion);
                Context.SaveChanges();

                return new ActionsResponseModel { Message = "Promotion deleted successfully!" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public ActionsResponseModel ChangePromotionActiveStatus(int merchantId, int promotionId)
        {
            try
            {
                var promotion = Context.Promotions.FirstOrDefault(p => p.MerchantId == merchantId && p.PromotionId == promotionId);
                if (promotion == null)
                    return new ActionsResponseModel { IsSuccess = false, Message = "Promotion not found." };

                promotion.IsActive = !promotion.IsActive;
                Context.SaveChanges();

                return new ActionsResponseModel { Message = "Promotion status changed successfully!" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }
        #endregion
    }
}
