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
using System.IO;
using RetailStation.Entities.DTOs.SystemSettings;
using RetailStation.Entities.Models.SystemAdmin;

namespace RetailStation.Service.Operation
{
    public class AdminService : IAdminService
    {

        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly ISharedFilterService SharedFilterService;
        private readonly string ConnectionString;
        private readonly IExportService ExportService;
        private readonly IFileService _fileService;
        private readonly string SliderImagesFolder = "SliderImages";
        private readonly string PartnerImagesFolder = "TopPartnersImages";
        private readonly string TotalValuePromotionImagesFolder = "TotalValuePromotionImages";


        public AdminService(DBContext Context, ISQLHelper SQLHelper,
            IConfiguration Configuration, IExportService ExportService,
            ISharedFilterService sharedFilterService, IFileService fileService)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.Configuration = Configuration;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
            this.ExportService = ExportService;
            SharedFilterService = sharedFilterService;
            _fileService = fileService;

        }


        #region Slider
        public List<SliderModel> GetSlidersData(SearchFilterModel filter, int? sliderId = null)
        {
            var query = Context.Sliders.AsNoTracking()
                .Where(s => (!sliderId.HasValue || s.SliderId == sliderId));

            int totalCount = query.Count();

            if (filter.CurrentPage > 0 && filter.PageSize > 0)
            {
                int skip = (filter.CurrentPage - 1) * filter.PageSize;
                query = query.Skip(skip).Take(filter.PageSize);
            }

            var results = query
                .Select(s => new SliderModel
                {
                    SliderId = s.SliderId,
                    Title = s.Title,
                    Description = s.Description,
                    ImageURL = s.Image,
                    Link = s.Link,
                    IsActive = s.IsActive,
                    CreatedBy = s.CreatedBy,
                    CreatedDate = s.CreatedDate,
                    ModifiedBy = s.ModifiedBy,
                    ModifiedDate = s.ModifiedDate
                })
                .ToList();

            foreach (var item in results.Where(x => !string.IsNullOrEmpty(x.ImageURL)))
            {
                item.ImageURL = _fileService.GetFileDownloadUrl(Path.Combine(SliderImagesFolder, item.ImageURL));
            }

            results.ForEach(x => x.TotalCount = totalCount);
            return results;
        }

        public SliderModel GetSliderById(int sliderId)
        {
            return GetSlidersData(new SearchFilterModel { PageSize = 1, CurrentPage = 1 }, sliderId).FirstOrDefault();
        }

        public async Task<ActionsResponseModel> AddSlider(SliderModel model)
        {
            try
            {
                var slider = new Slider
                {
                    Title = model.Title,
                    Description = model.Description,
                    Link = model.Link,
                    IsActive = model.IsActive,
                    CreatedBy = model.CreatedBy,
                    CreatedDate = DateTime.Now
                };

                if (model.Image != null)
                {
                    var upload = await _fileService.UploadFileAsync(model.Image, SliderImagesFolder, FileType.Image);
                    if (upload.IsUploaded)
                        slider.Image = upload.FilePath;
                    else
                        return new ActionsResponseModel { IsSuccess = false, Message = upload.Message };
                }

                Context.Sliders.Add(slider);
                Context.SaveChanges();
                return new ActionsResponseModel { Message = "Slider added successfully!" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public async Task<ActionsResponseModel> EditSlider(int sliderId, SliderModel model)
        {
            try
            {
                var slider = Context.Sliders.FirstOrDefault(s => s.SliderId == sliderId);
                if (slider == null)
                    return new ActionsResponseModel { IsSuccess = false, Message = "Slider not found." };

                slider.Title = model.Title;
                slider.Description = model.Description;
                slider.Link = model.Link;
                slider.IsActive = model.IsActive;
                slider.ModifiedBy = model.ModifiedBy;
                slider.ModifiedDate = DateTime.Now;

                if (model.Image != null)
                {
                    var upload = await _fileService.UploadFileAsync(model.Image, SliderImagesFolder, FileType.Image);
                    if (upload.IsUploaded)
                        slider.Image = upload.FilePath;
                    else
                        return new ActionsResponseModel { IsSuccess = false, Message = upload.Message };
                }

                Context.SaveChanges();
                return new ActionsResponseModel { Message = "Slider updated successfully!" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public ActionsResponseModel DeleteSlider(int sliderId)
        {
            try
            {
                var slider = Context.Sliders.FirstOrDefault(s => s.SliderId == sliderId);
                if (slider == null)
                    return new ActionsResponseModel { IsSuccess = false, Message = "Slider not found." };

                Context.Sliders.Remove(slider);
                Context.SaveChanges();

                return new ActionsResponseModel { Message = "Slider deleted successfully!" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public ActionsResponseModel ChangeSliderActiveStatus(int sliderId)
        {
            try
            {
                var slider = Context.Sliders.FirstOrDefault(s => s.SliderId == sliderId);
                if (slider == null)
                    return new ActionsResponseModel { IsSuccess = false, Message = "Slider not found." };

                slider.IsActive = !slider.IsActive;
                Context.SaveChanges();

                return new ActionsResponseModel { Message = "Slider status changed successfully!" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }
        #endregion

        
        #region TopPartners

        public List<TopPartnerModel> GetTopPartners_Data(SearchFilterModel filter, int? topPartnerId = null)
        {
            var query = Context.TopPartners.AsNoTracking()
                .Where(p => (!topPartnerId.HasValue || p.TopPartnerId == topPartnerId));

            int totalCount = query.Count();

            if (filter.CurrentPage > 0 && filter.PageSize > 0)
            {
                int skip = (filter.CurrentPage - 1) * filter.PageSize;
                query = query.Skip(skip).Take(filter.PageSize);
            }

            var results = query
                .Select(p => new TopPartnerModel
                {
                    TopPartnerId = p.TopPartnerId,
                    Name = p.Name,
                    DisplayName = p.DisplayName,
                    IsActive = p.IsActive,
                    ImageURL = p.Image,
                    Description = p.Description,
                    DisplayOrder = p.DisplayOrder,
                    CreatedBy = p.CreatedBy,
                    CreatedDate = p.CreatedDate,
                    ModifiedBy = p.ModifiedBy,
                    ModifiedDate = p.ModifiedDate
                })
                .ToList();

            foreach (var item in results.Where(x => !string.IsNullOrEmpty(x.ImageURL)))
            {
                item.ImageURL = _fileService.GetFileDownloadUrl(Path.Combine(PartnerImagesFolder, item.ImageURL));
            }

            results.ForEach(x => x.TotalCount = totalCount);
            return results;
        }


        public TopPartnerModel GetTopPartnerById(int topPartnerId)
        {
            return GetTopPartners_Data(new SearchFilterModel { PageSize = 1, CurrentPage = 1 }, topPartnerId).FirstOrDefault();
        }

        public async Task<ActionsResponseModel> AddTopPartner(TopPartnerModel model)
        {
            try
            {
                int maxDisplayOrder = Context.TopPartners.Max(x => x.DisplayOrder);
                var topPartner = new TopPartner
                {
                    Name = model.Name,
                    DisplayName = model.DisplayName,
                    Description = model.Description,
                    DisplayOrder = maxDisplayOrder + 1,
                    IsActive = model.IsActive,
                    CreatedBy = model.CreatedBy,
                    CreatedDate = DateTime.Now
                };

                if (model.Image != null)
                {
                    var upload = await _fileService.UploadFileAsync(model.Image, PartnerImagesFolder, FileType.Image);
                    if (upload.IsUploaded)
                        topPartner.Image = upload.FilePath;
                    else
                        return new ActionsResponseModel { IsSuccess = false, Message = upload.Message };
                }

                Context.TopPartners.Add(topPartner);
                Context.SaveChanges();
                return new ActionsResponseModel { Message = "TopPartner added successfully!" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public async Task<ActionsResponseModel> EditTopPartner(int topPartnerId, TopPartnerModel model)
        {
            try
            {
                var topPartner = Context.TopPartners.FirstOrDefault(p => p.TopPartnerId == topPartnerId);
                if (topPartner == null)
                    return new ActionsResponseModel { IsSuccess = false, Message = "TopPartner not found." };

                topPartner.Name = model.Name;
                topPartner.Description = model.Description;
                topPartner.DisplayName = model.DisplayName;
                topPartner.DisplayOrder = model.DisplayOrder ?? topPartner.DisplayOrder;
                topPartner.IsActive = model.IsActive;
                topPartner.ModifiedBy = model.ModifiedBy;
                topPartner.ModifiedDate = DateTime.Now;

                if (model.Image != null)
                {
                    var upload = await _fileService.UploadFileAsync(model.Image, PartnerImagesFolder, FileType.Image);
                    if (upload.IsUploaded)
                        topPartner.Image = upload.FilePath;
                    else
                        return new ActionsResponseModel { IsSuccess = false, Message = upload.Message };
                }

                Context.SaveChanges();
                return new ActionsResponseModel { Message = "TopPartner updated successfully!" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public ActionsResponseModel DeleteTopPartner(int topPartnerId)
        {
            try
            {
                var topPartner = Context.TopPartners.FirstOrDefault(p => p.TopPartnerId == topPartnerId);
                if (topPartner == null)
                    return new ActionsResponseModel { IsSuccess = false, Message = "TopPartner not found." };

                Context.TopPartners.Remove(topPartner);
                Context.SaveChanges();

                return new ActionsResponseModel { Message = "TopPartner deleted successfully!" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public ActionsResponseModel ChangeTopPartnerActiveStatus(int topPartnerId)
        {
            try
            {
                var topPartner = Context.TopPartners.FirstOrDefault(p => p.TopPartnerId == topPartnerId);
                if (topPartner == null)
                    return new ActionsResponseModel { IsSuccess = false, Message = "TopPartner not found." };

                topPartner.IsActive = !topPartner.IsActive;
                Context.SaveChanges();

                return new ActionsResponseModel { Message = "TopPartner status changed successfully!" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }
        #endregion

        #region BestSellerItems
        public List<BestSellerItemModel> GetBestSellerItems_Data()
        {
            var results = (from bestSellerItem in Context.BestSellerItems
                           join merchantItem in Context.MerchantItems
                            on bestSellerItem.MerchantItemId equals  merchantItem.MerchantItemId
                           join merchant in Context.Merchants
                            on merchantItem.MerchantId equals merchant.MerchantId
                           select new BestSellerItemModel
                           {
                               BestSellerItemId = bestSellerItem.BestSellerItemId,
                               MerchantItemId = bestSellerItem.MerchantItemId,
                               IsActive = bestSellerItem.IsActive,
                               DisplayOrder = bestSellerItem.DisplayOrder,
                               MerchantName = merchant.NameAR,
                               MerchantItemName = merchantItem.NameAR
                           }).OrderBy(bsi => bsi.DisplayOrder).ToList();
            return results;
        }
        public ActionsResponseModel UpdateBestSellerItems(List<BestSellerItemModel> BestSellerItems)
        {
            if (BestSellerItems == null)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = "Input list cannot be null." };
            }

            try
            {
                var itemsToUpdate = BestSellerItems
                    .Where(x => x.BestSellerItemId.HasValue && x.BestSellerItemId.Value > 0)
                    .ToList();

                var itemsToAdd = BestSellerItems
                    .Where(x => !x.BestSellerItemId.HasValue || x.BestSellerItemId.Value == 0)
                    .ToList();

                // --- DELETION LOGIC ---

                var submittedIds = itemsToUpdate
                    .Select(x => x.BestSellerItemId.Value)
                    .ToList();

                bool itemsRemoved = false;

                // Only run deletion logic if there are items in the database to compare against.
                if (Context.BestSellerItems.Any())
                {
                    var itemsToRemove = Context.BestSellerItems
                        .Where(dbItem => !submittedIds.Contains(dbItem.BestSellerItemId))
                        .ToList();

                    if (itemsToRemove.Any())
                    {
                        Context.BestSellerItems.RemoveRange(itemsToRemove);
                        itemsRemoved = true;
                    }
                }

                // --- UPDATE LOGIC ---

                if (itemsToUpdate.Any())
                {
                    var inputItemsMap = itemsToUpdate.ToDictionary(k => k.BestSellerItemId.Value, v => v);
                    var idsToUpdate = submittedIds; // Use the list prepared earlier

                    var existingDbItems = Context.BestSellerItems
                        .Where(dbi => idsToUpdate.Contains(dbi.BestSellerItemId))
                        .ToList();

                    foreach (var dbItem in existingDbItems)
                    {
                        if (inputItemsMap.TryGetValue(dbItem.BestSellerItemId, out BestSellerItemModel updatedData))
                        {
                            dbItem.DisplayOrder = updatedData.DisplayOrder;
                            dbItem.IsActive = updatedData.IsActive;
                        }
                    }
                }

                // --- ADD LOGIC ---

                if (itemsToAdd.Any())
                {
                    var newEntities = itemsToAdd.Select(item => new BestSellerItem
                    {
                        MerchantItemId = item.MerchantItemId,
                        IsActive = item.IsActive,
                        DisplayOrder = item.DisplayOrder
                    }).ToList();

                    Context.BestSellerItems.AddRange(newEntities);
                }

                // --- SAVE CHANGES ---

                if (itemsToUpdate.Any() || itemsToAdd.Any() || itemsRemoved)
                {
                    Context.SaveChanges();
                    return new ActionsResponseModel { IsSuccess = true, Message = "Best Seller items updated successfully." };
                }
                else if (!BestSellerItems.Any())
                {
                    return new ActionsResponseModel { IsSuccess = true, Message = "No items submitted and no existing items were found to remove." };
                }
                else
                {
                    return new ActionsResponseModel { IsSuccess = true, Message = "No items provided for update or addition." };
                }
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = "An unexpected error occurred while processing the best seller items."
                };
            }
        }
        public ActionsResponseModel AddUpdateBestSellerItems_Old(List<BestSellerItemModel> BestSellerItems)
        {

            try
            {
                var itemsToUpdate = (from item in BestSellerItems
                                     join bestSellerItem in Context.BestSellerItems
                                     on item.BestSellerItemId equals bestSellerItem.BestSellerItemId
                                     select bestSellerItem).ToList();

                var itemsToAdd = BestSellerItems.Where(x => x.BestSellerItemId == null).ToList();

                foreach (var item in itemsToUpdate)
                {
                    var updatedCategory = BestSellerItems.FirstOrDefault(c => c.BestSellerItemId == item.BestSellerItemId);
                    if (updatedCategory != null)
                    {
                        item.DisplayOrder = updatedCategory.DisplayOrder;
                    }
                }
                foreach (var item in itemsToAdd)
                {
                    var newBestSellerItem = new BestSellerItem
                    {
                        MerchantItemId = item.MerchantItemId,
                        IsActive = item.IsActive,
                        DisplayOrder = item.DisplayOrder
                    };
                }

                Context.SaveChanges();

                return new ActionsResponseModel { Message = "BestSeller updated successfully." };
            }
            catch (Exception ex)
            {

                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };

            };
        }

        #endregion

        #region TotalValuePromotions

        public List<TotalValuePromotionModel> GetTotalValuePromotions_Data(SearchFilterModel filter, int? promotionId = null)
        {
            var query = Context.TotalValuePromotions.AsNoTracking()
                .Where(p => (!promotionId.HasValue || p.TotalValuePromotionId == promotionId));

            int totalCount = query.Count();

            if (filter.CurrentPage > 0 && filter.PageSize > 0)
            {
                int skip = (filter.CurrentPage - 1) * filter.PageSize;
                query = query.OrderByDescending(p => p.CreatedDate).Skip(skip).Take(filter.PageSize);
            }

            var results = query
                .Select(p => new TotalValuePromotionModel
                {
                    TotalValuePromotionId = p.TotalValuePromotionId,
                    Code = p.Code,
                    Title = p.Title,
                    Description = p.Description,
                    ImageURL = p.Image,
                    DiscountValue = p.DiscountValue,
                    IsPercentage = p.IsPercentage,
                    ValueType = p.ValueType,
                    MaxUsesGlobal = p.MaxUsesGlobal,
                    MaxUsesPerCustomer = p.MaxUsesPerCustomer,
                    MinValue = p.MinValue,
                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                    IsActive = p.IsActive,
                    CreatedBy = p.CreatedBy,
                    CreatedDate = p.CreatedDate,
                    ModifiedBy = p.ModifiedBy,
                    ModifiedDate = p.ModifiedDate
                })
                .ToList();

            foreach (var item in results.Where(x => !string.IsNullOrEmpty(x.ImageURL)))
            {
                item.ImageURL = _fileService.GetFileDownloadUrl(Path.Combine(TotalValuePromotionImagesFolder, item.ImageURL));
            }

            results.ForEach(x => x.TotalCount = totalCount);
            return results;
        }

        public TotalValuePromotionModel GetTotalValuePromotionById(int promotionId)
        {
            return GetTotalValuePromotions_Data(new SearchFilterModel { PageSize = 1, CurrentPage = 1 }, promotionId).FirstOrDefault();
        }

        public async Task<ActionsResponseModel> AddTotalValuePromotion(TotalValuePromotionModel model)
        {
            try
            {
                var promotion = new TotalValuePromotion
                {
                    Code = model.Code,
                    Title = model.Title,
                    Description = model.Description,
                    DiscountValue = model.DiscountValue,
                    IsPercentage = model.ValueType == "PERCENT",//model.IsPercentage ,
                    ValueType = model.ValueType,
                    MaxUsesGlobal = model.MaxUsesGlobal,
                    MaxUsesPerCustomer = model.MaxUsesPerCustomer,
                    MinValue = model.MinValue,
                    StartDate = model.StartDate,
                    EndDate = model.EndDate,
                    IsActive = model.IsActive,
                    CreatedBy = model.CreatedBy,
                    CreatedDate = DateTime.Now
                };

                if (model.Image != null)
                {
                    var upload = await _fileService.UploadFileAsync(model.Image, TotalValuePromotionImagesFolder, FileType.Image);
                    if (upload.IsUploaded)
                        promotion.Image = upload.FilePath;
                    else
                        return new ActionsResponseModel { IsSuccess = false, Message = upload.Message };
                }

                Context.TotalValuePromotions.Add(promotion);
                Context.SaveChanges();
                return new ActionsResponseModel { Message = "TotalValuePromotion added successfully!" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public async Task<ActionsResponseModel> EditTotalValuePromotion(int promotionId, TotalValuePromotionModel model)
        {
            try
            {
                var promotion = Context.TotalValuePromotions.FirstOrDefault(p => p.TotalValuePromotionId == promotionId);
                if (promotion == null)
                    return new ActionsResponseModel { IsSuccess = false, Message = "TotalValuePromotion not found." };

                promotion.Code = model.Code;
                promotion.Title = model.Title;
                promotion.Description = model.Description;
                promotion.DiscountValue = model.DiscountValue;
                promotion.IsPercentage = model.ValueType == "PERCENT";//model.IsPercentage;
                promotion.ValueType = model.ValueType;
                promotion.MaxUsesGlobal = model.MaxUsesGlobal;
                promotion.MaxUsesPerCustomer = model.MaxUsesPerCustomer;
                promotion.MinValue = model.MinValue;
                promotion.StartDate = model.StartDate;
                promotion.EndDate = model.EndDate;
                promotion.IsActive = model.IsActive;
                promotion.ModifiedBy = model.ModifiedBy;
                promotion.ModifiedDate = DateTime.Now;

                if (model.Image != null)
                {
                    var upload = await _fileService.UploadFileAsync(model.Image, TotalValuePromotionImagesFolder, FileType.Image);
                    if (upload.IsUploaded)
                        promotion.Image = upload.FilePath;
                    else
                        return new ActionsResponseModel { IsSuccess = false, Message = upload.Message };
                }

                Context.SaveChanges();
                return new ActionsResponseModel { Message = "TotalValuePromotion updated successfully!" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public ActionsResponseModel DeleteTotalValuePromotion(int promotionId)
        {
            try
            {
                var promotion = Context.TotalValuePromotions.FirstOrDefault(p => p.TotalValuePromotionId == promotionId);
                if (promotion == null)
                    return new ActionsResponseModel { IsSuccess = false, Message = "TotalValuePromotion not found." };

                Context.TotalValuePromotions.Remove(promotion);
                Context.SaveChanges();

                return new ActionsResponseModel { Message = "TotalValuePromotion deleted successfully!" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public ActionsResponseModel ChangeTotalValuePromotionActiveStatus(int promotionId)
        {
            try
            {
                var promotion = Context.TotalValuePromotions.FirstOrDefault(p => p.TotalValuePromotionId == promotionId);
                if (promotion == null)
                    return new ActionsResponseModel { IsSuccess = false, Message = "TotalValuePromotion not found." };

                promotion.IsActive = !promotion.IsActive;
                promotion.ModifiedDate = DateTime.Now; 
                Context.SaveChanges();

                return new ActionsResponseModel { Message = "TotalValuePromotion status changed successfully!" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }
        #endregion
    }
}
