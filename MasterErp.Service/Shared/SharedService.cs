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
    public class SharedService:ISharedService
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

        public SharedService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration,IExportService exportService)
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

        public DataTable MapFilterModelToDataTable(List<FilterItem> Items)
        {
            DataTable dt = new DataTable();
            dt.Clear();
            dt.Columns.Add("CategoryDisplayName");
            dt.Columns.Add("CategoryName");
            dt.Columns.Add("ItemKey");
            dt.Columns.Add("ItemFlag");
            dt.Columns.Add("ItemValue");

            foreach (FilterItem item in Items)
            {
                DataRow row = dt.NewRow();

                row["CategoryDisplayName"] = item.CategoryDisplayName;
                row["CategoryName"] = item.CategoryName;
                row["ItemKey"] = item.ItemKey;
                row["ItemFlag"] = item.ItemFlag;
                row["ItemValue"] = item.ItemValue;
                dt.Rows.Add(row);
            }

            return dt;
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
        #endregion

    }
}
