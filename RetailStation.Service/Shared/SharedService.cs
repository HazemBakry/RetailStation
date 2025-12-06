using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Enums;
using RetailStation.Entities.Models;
using RetailStation.Interface.Common;
using RetailStation.Interface.Shared;
using Microsoft.CodeAnalysis;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using RetailStation.Entities.Models.Subscription;

namespace RetailStation.Service.Shared
{
    public class SharedService : ISharedService
    {
        private readonly DBContext Context;
        private readonly IExportService _exportService;

        public SharedService(DBContext dBContext, ISQLHelper iSQLHelper, IExportService exportService)
        {
            Context = dBContext;
            _exportService = exportService;
        }

        public List<Customer> GetCustomersData()
        {
            return Context.Customers.ToList();
        }

        public ActionsResponseModel DownloadImporterTemplate(ExcelExportStyle ImporterType)
        {
            var url = _exportService.DownloadImporterTemplate(ImporterType);
            return new ActionsResponseModel
            {
                Status = 1,
                URL = url,
                Message = "File uploaded successfully"
            };
        }

        #region Selectors

        public List<SelectorDataModel> GetStoresSelector()
        {
            //var results = Context.Stores.Select(b => new SelectorDataModel
            //{
            //    Id = b.StoreId,
            //    Name = b.NameAR,
            //}).ToList();
            //return results;
            return new List<SelectorDataModel>();
        }

      
        public List<SelectorDataModel> GetSuppliersSelector()
        {
            //var results = Context.Suppliers.Select(b => new SelectorDataModel
            //{
            //    Id = b.SupplierId,
            //    Name = b.NameAR,
            //}).ToList();
            //return results;

            return new List<SelectorDataModel>();
        }
        
        public List<SelectorDataModel> GetMerchantsSelector()
        {
            var results = Context.Merchants.Select(b => new SelectorDataModel
            {
                Id = b.MerchantId,
                Name = b.NameAR,
            }).ToList();
            return results;
        }

        public List<SelectorDataModel> GetCustomersSelector()
        {
            var results = Context.Customers.Select(b => new SelectorDataModel
            {
                Id = b.CustomerId,
                Name = b.NameAR,
            }).ToList();
            return results;
        }

     
        public List<SelectorDataModel> GetItemsSelector()
        {
            var results = Context.Items.Select(b => new SelectorDataModel
            {
                Id = b.ItemId,
                Name = b.NameAR ?? b.NameEN,
                Code = b.Code
            }).ToList();
            return results;

        }
        
        public List<SelectorDataModel> GetCurrentMerchantItemsSelector(int merchantId)
        {
            var results = Context.MerchantItems.Where(i=>i.MerchantId==merchantId&&i.IsActive).Select(b => new SelectorDataModel
            {
                Id = (int)b.MerchantItemId,
                Name = b.NameAR ?? b.NameEN,
                Code = b.Code
            }).ToList();
            return results;

        }

        public List<SelectorDataModel> GetItemCategoriesSelector()
        {
            var results = Context.ItemCategories.Select(b => new SelectorDataModel
            {
                Id = b.ItemCategoryId,
                Name = b.NameAR,
            }).ToList();
            return results;

        }

        public List<SelectorDataModel> GetUnitsSelector()
        {
            var results = Context.Units.Select(b => new SelectorDataModel
            {
                Id = b.UnitId,
                Name = b.NameAR,
            }).ToList();
            return results;
        }

        public List<SelectorDataModel> GetItemLookupsSelector()
        {
            //var results = Context.ItemLookups.Select(b => new SelectorDataModel
            //{
            //    Id = b.ItemLookupId,
            //    Name = b.NameAR,
            //}).ToList();
            //return results;
            return new List<SelectorDataModel>();

        }
        public List<SelectorDataModel_Str> GetSubscribersSelector()
        {
            var results = Context.Subscribers.Select(b => new SelectorDataModel_Str
            {
                Id = b.SubscriberId,
                Name = b.SubscriberName,
            }).ToList();
            return results;

        }
        public List<SelectorDataModel> GetRegionIdSelector(int? CountryId = null, int? CityId = null)
        {
            return Context.Regions.Where(x => (!CountryId.HasValue || CountryId == x.CountryId) && (!CityId.HasValue || CityId == x.CityId)).Select(x => new SelectorDataModel
            {
                Id = x.RegionId,
                Name = x.NameAR ?? x.NameEN
            }).ToList();
        }
        public List<SelectorDataModel> GetCitiesSelector(int? CountryId = null)
        {
            return Context.Cities.Where(x => (!CountryId.HasValue || CountryId == x.CountryId)).Select(x => new SelectorDataModel
            {
                Id = x.CityId,
                Name = x.NameAR ?? x.NameEN
            }).ToList();
        }
        public List<SelectorDataModel> GetCountriesSelector()
        {
            var results = Context.Countries.Select(b => new SelectorDataModel
            {
                Id = b.CountryId,
                Name = b.NameAR,
                Code = b.CountryCode,
            }).ToList();
            return results;
        }
        #endregion

    }
}
