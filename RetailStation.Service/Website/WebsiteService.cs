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
using RetailStation.Interface.Website;
using RetailStation.Entities.DTOs.Website;
using System.IO;

namespace RetailStation.Service.Website
{
    public class WebsiteService : IWebsiteService
    {
        private readonly DBContext Context;
        private readonly LookupsDbContext LookupsDbContext;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly ISharedFilterService SharedFilterService;
        private readonly string ConnectionString;
        private readonly string ApiUrl;
        private readonly IExportService ExportService;
        private readonly IFileService _fileService;

        public WebsiteService(DBContext Context, ISQLHelper SQLHelper,
            IConfiguration Configuration, IExportService ExportService,
            ISharedFilterService sharedFilterService, LookupsDbContext lookupsDbContext, IFileService fileService)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.Configuration = Configuration;
            this.ConnectionString = Configuration.GetConnectionString("DBConnection");
            this.ApiUrl = Configuration.GetSection("ApiUrl").Value;
            this.ExportService = ExportService;
            SharedFilterService = sharedFilterService;
            LookupsDbContext = lookupsDbContext;
            _fileService = fileService;
        }

        public List<SliderModel> GetWebsiteMainSlider()
        {
            var query = Context.Sliders.AsNoTracking()
               .Where(s => s.IsActive);

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
                item.ImageURL = item.ImageURL != null ? Path.Combine(ApiUrl, "SliderImages", item.ImageURL) : "";  //_fileService.GetFileDownloadUrl(item.ImageURL);
            }
            return results;
        }

        public List<ItemCategoryModel> GetWebsiteHomeCategories(int? CategoryId = null)
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
            return result;
        }

        public List<ItemDto> GetItemsByCategoryId(int CategoryId, SearchFilterModel model)
        {
            var query = (from cat in Context.Items
                             //join parentGroup in Context.ItemCategories on cat.ParentCategoryId equals parentGroup.ItemCategoryId into jT2
                             //from parentGroup in jT2.DefaultIfEmpty()
                         select new ItemDto
                         {
                             ItemId = cat.ItemId,
                             NameAR = cat.NameAR,
                             NameEN = cat.NameEN,
                             IsActive = cat.IsActive,
                             ItemCategoryId = cat.ItemCategoryId,
                             ImageUrl = "http://localhost:63246/ItemsImages/image1.jpg", // cat.ImageUrl != null ? Path.Combine(ApiUrl, "ItemsImages", cat.ImageUrl) : "",
                             CreatedBy = cat.CreatedBy,
                             CreatedDate = cat.CreatedDate,
                             ModifiedBy = cat.ModifiedBy,
                             ModifiedDate = cat.ModifiedDate
                         }).Where(x => x.ItemCategoryId == CategoryId);//.ToList();//.OrderBy(c => c.DisplayOrder).ToList();


            int totalCount = query.Count();
            if (model.CurrentPage > 0 && model.PageSize > 0)
            {
                int skip = (model.CurrentPage - 1) * model.PageSize;
                query = query.Skip(skip).Take(model.PageSize);
            }

            var result = query.ToList();
            foreach (var item in result) { item.TotalCount = totalCount; }

            return result;
        }

        public List<SupplierItemModel> GetWebsiteItems_Data(SearchFilterModel model)
        {
            DataTable dt = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] Params = new SqlParameter[]
            {
                new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value),
                new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value),
                new SqlParameter("@FilterList", SqlDbType.Structured) { Value = dt },
            };

            var result = SQLHelper.SQLQuery<SupplierItemModel>("[Website].[SP_GetWebsiteItems_Data]", ConnectionString, Params);
            foreach (var item in result.Where(x => !string.IsNullOrEmpty(x.ImageUrl)))
            {
                item.ImageUrl = item.ImageUrl != null ? Path.Combine(ApiUrl, "ItemsImages", item.ImageUrl) : "";//_fileService.GetFileDownloadUrl(item.ImageUrl);
            }
            return result;

        }

        public List<FilterModel> GetWebsiteItems_Filters(SearchFilterModel model)
        {
            DataTable dt = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] Params = new SqlParameter[]
            {
                new SqlParameter("@FilterList", SqlDbType.Structured) { Value = dt },
            };

            var result = SQLHelper.SQLQuery<FilterItem>("[Website].[SP_GetWebsiteItems_Filters]", ConnectionString, Params);
            var grouped = SharedFilterService.GroupedFilterItems(result);
            return grouped;
        }

        public List<PromotionModel> GetWebsitePromotionItems(SearchFilterModel model)
        {
            DataTable dt = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] Params = new SqlParameter[]
            {
                new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value),
                new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value),
                new SqlParameter("@FilterList", SqlDbType.Structured) { Value = dt },
            };

            var result = SQLHelper.SQLQuery<PromotionModel>("[Website].[SP_GetWebsitePromotionItems]", ConnectionString, Params);
            foreach (var item in result.Where(x => !string.IsNullOrEmpty(x.ImageURL)))
            {
                item.ImageURL = item.ImageURL != null ? Path.Combine(ApiUrl, "SliderImages", item.ImageURL) : ""; //_fileService.GetFileDownloadUrl(item.ImageURL);
            }
            return result;
        }

        public SupplierItemModel GetWebsiteItemDetailsById(int SupplierItemId)
        {
            return GetWebsiteItems_Data(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }).FirstOrDefault();
        }
    }
}
