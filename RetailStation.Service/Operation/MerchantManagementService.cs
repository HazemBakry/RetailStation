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
using RetailStation.Entities.Models.Purchases;
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
    }
}
