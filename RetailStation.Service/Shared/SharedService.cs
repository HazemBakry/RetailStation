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

        public List<DailyNotebook> GetLeadgerJournalsData()
        {
            return Context.DailyNotebooks.ToList();
        }

        public List<SelectorDataModel> GetReceiptLedgersSelector(int PaymentTypeId)
        {
            var results = Context.ReceiptLedgers.Where(x => x.PaymentTypeId == PaymentTypeId).Select(b => new SelectorDataModel
            {
                Id = b.ReceiptLedgerId,
                Name = b.NameEN ?? "",
            }).ToList();
            return results;
        }

        public List<SelectorDataModel> GetAccountsByTypeId(int TypeId)
        {
            var result = Context.AccountTrees.Where(x => x.AccountTypeId == TypeId).Select(b => new SelectorDataModel
            {
                Id = b.AccountId,
                Name = b.NameAR,
                //Code = b.AccountNumber
            }).ToList();

            return result;
        }

        public List<FinancialPeriod> GetFinancialPeriods()
        {
            var result = Context.FinancialPeriods.ToList();

            return result;
        }
        public FinancialPeriod GetCurrentFinancialPeriod()
        {
            var result = Context.FinancialPeriods.Where(x => x.IsActive).OrderByDescending(x => x.NameEN).FirstOrDefault();

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
                Name = b.NameAR,
            }).ToList();
            return results;
        }

        public List<SelectorDataModel> GetSponsorsSelector()
        {
            var results = Context.Sponsors.Select(b => new SelectorDataModel
            {
                Id = b.SponsorId,
                Name = b.NameAR ?? b.NameEN,
            }).ToList();
            return results;
        }
        public List<SelectorDataModel> GetOrderStatusSelector()
        {
            var results = Context.OrderStatus.Select(b => new SelectorDataModel
            {
                Id = b.StatusId,
                Name = b.NameAR,
            }).ToList();
            return results;
        }

        public List<SelectorDataModel> GetStoresSelector()
        {
            var results = Context.Stores.Select(b => new SelectorDataModel
            {
                Id = b.StoreId,
                Name = b.NameAR,
            }).ToList();
            return results;
        }

        public List<SelectorDataModel> GetAccountsSelector(bool? IsGroup, int? AccountTypeId)
        {
            var result = Context.AccountTrees.Where(x => (IsGroup == null || x.IsGroup == IsGroup) && (AccountTypeId == null || x.AccountTypeId == AccountTypeId)).Select(a => new SelectorDataModel
            {
                Id = a.AccountId,
                Name = a.NameAR,
                Code = a.AccountNumber
            }).ToList();

            return result;
        }

        public List<SelectorDataModel> GetCostCenterSelector(bool IsParent, int? AccountId)
        {
            if (AccountId != null)
            {

            }
            var result = Context.CostCenterTree.Where(x => x.IsParent == IsParent).Select(a => new SelectorDataModel
            {
                Id = a.CostCenterId,
                Name = a.NameAR,
                Code = a.CostCenterNumber
            }).ToList();

            return result;
        }
        public List<SelectorDataModel> GetJournalTemplatesSelector()
        {
            var result = Context.JournalTemplates.Select(a => new SelectorDataModel
            {
                Id = a.JournalTemplateId,
                Name = a.NameAR
            }).ToList();

            return result;
        }

        public List<SelectorDataModel> GetIqamaIssuePlacesSelector()
        {
            var results = Context.Regions.Select(b => new SelectorDataModel
            {
                Id = (int)b.RegionId,
                Name = b.NameAR ?? "",
            }).ToList();
            return results;
        }

        public List<SelectorDataModel> GetBanksSelector()
        {
            var results = Context.Banks.Select(b => new SelectorDataModel
            {
                Id = (int)b.BankId,
                Name = b.NameAR ?? "",
            }).ToList();
            return results;
        }

        public List<SelectorDataModel> GetVisaJobsSelector()
        {
            var results = Context.Jobs.Select(b => new SelectorDataModel
            {
                Id = (int)b.JobId,
                Name = b.NameAR,
            }).ToList();
            return results;
        }

        public List<SelectorDataModel> GetRegionsSelector()
        {
            var results = Context.Regions.Select(b => new SelectorDataModel
            {
                Id = (int)b.RegionId,
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

        public List<SelectorDataModel> GetCustomersSelector()
        {
            var results = Context.Customers.Select(b => new SelectorDataModel
            {
                Id = b.CustomerId,
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
        public List<SelectorDataModel> GetChildAccountsSelector()
        {
            var results = Context.AccountTrees.Where(x => x.AccountLevel == 5).Select(b => new SelectorDataModel
            {
                Id = b.AccountId,
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

        public object GetArabicEnglishNumberText(int ReceiptId)
        {
            var receipt = Context.PaymentReceipts.FirstOrDefault(x => x.PaymentReceiptId == ReceiptId);
            if (receipt.CurrencyId == null)
                return new { DescAr = "", DescEn = "" };
            CurrencyInfo currencies = new CurrencyInfo(receipt.CurrencyId.Value, Context);
            ToWord toWord = new ToWord(decimal.Parse(receipt.MoneyAmount.ToString()), currencies);
            var descAr = toWord.ConvertToArabic();
            var descEn = toWord.ConvertToEnglish();
            return new { DescAr = descAr, DescEn = descEn };
        }

        public List<SelectorDataModel> GetDepartmentsSelector()
        {
            var results = Context.Departments.Select(b => new SelectorDataModel
            {
                Id = b.DepartmentId.GetValueOrDefault(),
                Name = b.NameAR ?? b.NameEN,
            }).ToList();
            return results;
        }

        public List<SelectorDataModel> GetEmployeeStatusSelector()
        {
            return Context.EmployeeStatus.Select(x => new SelectorDataModel
            {
                Id = x.EmployeeStatusId,
                Name = x.StatusNameAR ?? x.StatusNameEN
            }).ToList();
        }

        #endregion

    }
}
