using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Enums;
using RetailStation.Entities.Common.Finance.GeneralAccounts;
using RetailStation.Entities.Models;
using RetailStation.Entities.Models.Finance;
using RetailStation.Interface.Common;
using RetailStation.Interface.Shared;
using Microsoft.CodeAnalysis;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RetailStation.Entities.Models.Subscription;
using RetailStation.Entities.DTOs.Lookups;

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

        public BranchDto GetBranchById(string SubscriberId, int BranchId)
        {
            //var results = Context.Branches.Where(b => b.BranchId == BranchId && b.SubscriberId == SubscriberId)
            //.Select(b => new BranchDto
            //{
            //    BranchId = b.BranchId,
            //    SubscriberId = b.SubscriberId,
            //    Code = b.Code,
            //    DisplayOrder = b.DisplayOrder,
            //    NameAR = b.NameAR,
            //    NameEN = b.NameEN,
            //    IsActive = b.IsActive,
            //    IsAdminBranch = b.IsAdminBranch,
            //    CityId = b.CityId,
            //    DrawingsCostCenterId = b.DrawingsCostCenterId,
            //    ExpensesCostCenterId = b.ExpensesCostCenterId,
            //    Phone = b.Phone,
            //    Email = b.Email,
            //    Fax = b.Fax,
            //    Address = b.Address,
            //    Notes = b.Notes,
            //}).FirstOrDefault();
            //return results;

            return new BranchDto
            {
                BranchId = BranchId,
                SubscriberId = SubscriberId,
                NameAR = "Main Branch",
                NameEN = "Main Branch",
                IsActive =true,
                IsAdminBranch = true
            };
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
        public List<SelectorDataModel> GetBranchesSelector()
        {
            var results = Context.Branches.Select(b => new SelectorDataModel
            {
                Id = b.BranchId,
                Name = b.NameAR,
            }).ToList();
            return results;
        }

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

        #endregion

    }
}
