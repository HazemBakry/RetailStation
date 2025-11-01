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
using RetailStation.Interface.SupplierManagement;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using RetailStation.Entities.Models.Purchases;
using System.IO;

namespace RetailStation.Service.SupplierManagement
{
    public class SupplierManagementService : ISupplierManagementService
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
        public readonly string ItemsImagesFolder;
        public readonly string ApiUrl;

        public SupplierManagementService(DBContext Context, ISQLHelper SQLHelper,
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
            ItemsImagesFolder = "ItemsImages";
            _dataImportService = dataImportService;
            this.ApiUrl = Configuration.GetSection("ApiUrl").Value;

        }


        public List<SupplierItemModel> GetSupplierItemsData(int SupplierId, SearchFilterModel model, int? SupplierItemId = null)
        {
            DataTable dt = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] Params = new SqlParameter[]
            {
                new SqlParameter("@SupplierItemId", (object)SupplierItemId ?? DBNull.Value),
                new SqlParameter("@SupplierId", (object)SupplierId ?? DBNull.Value),
                new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value),
                new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value),
                new SqlParameter("@FilterList", SqlDbType.Structured) { Value = dt },
            };

            var result = SQLHelper.SQLQuery<SupplierItemModel>("[dbo].[SP_GetSupplierItemsData]", ConnectionString, Params);
            foreach (var item in result.Where(x => !string.IsNullOrEmpty(x.ImageUrl)))
            {
                item.ImageUrl = item.ImageUrl != null ? Path.Combine(ApiUrl, "ItemsImages", item.ImageUrl) : ""; //_fileService.GetFileDownloadUrl(item.ImageUrl);
            }
            return result;

        }
        public SupplierItemModel GetSupplierItemDetailsById(int SupplierId, int SupplierItemId)
        {
            return GetSupplierItemsData(SupplierId, new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, SupplierItemId).FirstOrDefault();
        }
        public async Task<ActionsResponseModel> AddNewSupplierItem(int SupplierId, SupplierItemModel model)
        {
            try
            {
                SupplierItem Item = new SupplierItem
                {
                    SupplierId = SupplierId,
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
                Context.SupplierItems.Add(Item);
                Context.SaveChanges();
                return new ActionsResponseModel { Message = "Item Added Successful !" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }
        public async Task<ActionsResponseModel> EditSupplierItem(int SupplierId, int SupplierItemId, SupplierItemModel model)
        {

            try
            {
                var item = Context.SupplierItems.Where(i => i.SupplierItemId == SupplierItemId && i.SupplierId == SupplierId).FirstOrDefault();
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
        public ActionsResponseModel DeleteSupplierItem(int SupplierId, int SupplierItemId)
        {
            try
            {
                var item = Context.SupplierItems.FirstOrDefault(m => m.SupplierItemId == SupplierItemId && m.SupplierId == SupplierId);
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
        public ActionsResponseModel ExportSupplierItem(int SupplierId, string UserName, SearchFilterModel SearchModel)
        {
            string url = string.Empty;
            try
            {
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 990000;
                var Data = GetSupplierItemsData(SupplierId, SearchModel);

                var result = Data.Select(res =>
                                new SupplierItemExportModel
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
                    result.Add(new SupplierItemExportModel());

                }


                var dtExport = DalHelper.ConvertToDataTable(result, "Supplier Items");


                url = GetExportFilePath(dtExport, UserName, "Supplier Items");


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


        public ActionsResponseModel ChangeSupplierItemActiveStatus(int SupplierId, int SupplierItemId)
        {
            try
            {
                var item = Context.SupplierItems.Where(a => a.SupplierItemId == SupplierItemId && a.SupplierId == SupplierId).FirstOrDefault();

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

        public async Task<ActionsResponseModel> MapSupplierItem(int SupplierId, int SupplierItemId, int? ItemId)
        {
            try
            {
                var item = Context.SupplierItems.Where(i => i.SupplierItemId == SupplierItemId && i.SupplierId == SupplierId).FirstOrDefault();
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
        public async Task<ActionsResponseModel> MarkItemAsBestSeller(int SupplierItemId)
        {
            try
            {
                var item = Context.SupplierItems.Where(i => i.SupplierItemId == SupplierItemId).FirstOrDefault();
                if (item != null)
                {
                    item.IsBestSellerItem = !item.IsBestSellerItem;
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

        public async Task<ActionsResponseModel> ImportSupplierItemsFile(int SupplierId, string ImporterName, IFormFile file)
        {

            try
            {
                SqlParameter[] Params = new SqlParameter[]
                {
                    new SqlParameter("@SupplierId", SupplierId),
                };
                var response = await _dataImportService.ExecuteImporter(file, Params, "[Import].[SP_Import_SupplierItems]", ImporterName);
                return response;
            }
            catch (Exception ex)
            {

                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };

            }
        }


        public ActionsResponseModel ItemQuickUpdate(int SupplierId, int SupplierItemId, decimal Price, int UnitId)
        {
            try
            {
                var item = Context.SupplierItems.Where(a => a.SupplierItemId == SupplierItemId && a.SupplierId == SupplierId).FirstOrDefault();

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
