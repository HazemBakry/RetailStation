using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.Shared;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.Shared
{
    public class SharedService : ISharedService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly IExportService _exportService;

        private string ConnectionString
        {
            get
            {
                return Configuration.GetConnectionString("DBConnection");
            }
        }

        public SharedService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration, IExportService exportService)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
            _exportService = exportService;
        }


        public List<Customer> GetCustomersData()
        {
            return Context.Customers.ToList();
        }
        public List<ReceiptLedger> GetReceiptLedgersData()
        {
            return Context.ReceiptLedger.ToList();
        }

        public List<AccountTree> GetAccountsList(bool IsParent)
        {
            var result = Context.AccountTrees.Where(x => x.IsParent == IsParent).ToList();

            return result;
        }
        public List<AccountTree> GetAccountsByTypeId(int TypeId)
        {
            var result = Context.AccountTrees.Where(x => x.AccountTypeId == TypeId).ToList();

            return result;
        }

        public List<ReceitLedgerType> GetReceiptLedgerTypesData()
        {
            var result = Context.ReceitLedgerType.ToList();

            return result;
        }
        public List<FinancialPeriod> GetFinancialPeriods()
        {
            var result = Context.FinancialPeriods.ToList();

            return result;
        }

        public List<AccountType> GetAccountTypes()
        {
            var result = Context.AccountTypes.ToList();

            return result;
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
                Name = b.NameEN,
            }).ToList();
            return results;
        }

        public List<SelectorDataModel> GetBanksSelector()
        {
            var results = Context.Banks.Select(b => new SelectorDataModel
            {
                Id = b.BankID,
                Name = b.Name,
            }).ToList();
            return results;
        }
        public List<SelectorDataModel> GetNationalitiesSelector()
        {
            var results = Context.Nationalities.Select(b => new SelectorDataModel
            {
                Id = b.NationalityId,
                Name = b.NameAR,
            }).ToList();
            return results;
        }
        public List<SelectorDataModel> GetIqamaIssuePlacesSelector()
        {
            var results = Context.IqamaIssuePlaces.Select(b => new SelectorDataModel
            {
                Id = b.IqamaIssuePlaceId,
                Name = b.NameAR,
            }).ToList();
            return results;
        }
        public List<SelectorDataModel> GetIqamaJobsSelector()
        {
            var results = Context.IqamaJobs.Select(b => new SelectorDataModel
            {
                Id = b.IqamaJobId,
                Name = b.NameAR,
            }).ToList();
            return results;
        }
        public List<SelectorDataModel> GetCountriesSelector()
        {
            var results = Context.Countries.Select(b => new SelectorDataModel
            {
                Id = b.CountryId,
                Name = b.NameAR,
            }).ToList();
            return results;
        }
        public List<SelectorDataModel> GetCitiesSelector()
        {
            var results = Context.Cities.Select(b => new SelectorDataModel
            {
                Id = b.CityId,
                Name = b.NameAR,
            }).ToList();
            return results;
        }
        public List<SelectorDataModel> GetRegionsSelector()
        {
            var results = Context.Regions.Select(b => new SelectorDataModel
            {
                Id = b.RegionId,
                Name = b.NameAR,
            }).ToList();
            return results;
        }
        public List<SelectorDataModel> GetSuppliersSelector()
        {
            var results = Context.Suppliers.Select(b => new SelectorDataModel
            {
                Id = b.SupplierId,
                Name = b.NameAR,
            }).ToList();
            return results;
        }
        public List<SelectorDataModel> GetSupplierGroupsSelector()
        {
            var results = Context.SupplierGroups.Select(b => new SelectorDataModel
            {
                Id = b.SupplierGroupId,
                Name = b.NameAR,
            }).ToList();
            return results;
        }
        public List<SelectorDataModel> GetPurchaseInvoiceTypesSelector()
        {
            var results = Context.PurchaseInvoiceTypes.Select(b => new SelectorDataModel
            {
                Id = b.PurchaseInvoiceTypeId,
                Name = b.NameAR,
            }).ToList();
            return results;
        }

        public List<SelectorDataModel> GetItemsSelector()
        {
            var results = Context.Items.Select(b => new SelectorDataModel
            {
                Id = b.ItemId,
                Name = b.NameAR,
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
        public List<SelectorDataModel> GetChildAccountsSelector()
        {
            var results = Context.AccountTrees.Where(x => x.AccountLevel == 5).Select(b => new SelectorDataModel
            {
                Id = b.AccountId,
                Name = b.NameAR,
            }).ToList();
            return results;
        }
        public List<SelectorDataModel> GetInventoriesSelector()
        {
            var results = Context.Stores.Select(b => new SelectorDataModel
            {
                Id = b.StoreId,
                Name = b.NameAR,
            }).ToList();
            return results;
        }
        public List<SelectorDataModel> GetItemLookupsSelector()
        {
            var results = Context.ItemLookups.Select(b => new SelectorDataModel
            {
                Id = b.ItemLookupId,
                Name = b.NameAR,
            }).ToList();
            return results;
        }

        #endregion

    }
}
