using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Lookups;
using RetailStation.Entities.Models;
using RetailStation.Interface.Common;
using RetailStation.Interface.Shared;
using RetailStation.Service.Common;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Service.Shared
{
    public class LookupService : ILookupService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly IExportService _exportService;
        private readonly string ConnectionString;
        private readonly LookupsDbContext LookupsContext;
        public LookupService(DBContext dBContext, ISQLHelper ISQLHelper, IConfiguration _configuration, LookupsDbContext lookupsContext)
        {
            SQLHelper = ISQLHelper;
            Configuration = _configuration;
            ConnectionString = Configuration.GetConnectionString("LookupDB");
            LookupsContext = lookupsContext;
        }

        #region Global Lookups

        public List<SelectorDataModel> GetBanksSelector()
        {
            //SqlParameter[] Params = new SqlParameter[0];

            //var result = SQLHelper.SQLQuery<SelectorDataModel>("[Global].[SP_GetBanks]", ConnectionString, Params);
            //return result;
            return LookupsContext.Banks.Select(x => new SelectorDataModel
            {
                Id = x.BankId,
                Name = x.NameAR ?? x.NameEN
            }).ToList();
        }
        public List<SelectorDataModel> GetIqamaIssuePlacesSelector()
        {
         
            return LookupsContext.IqamaIssuePlaces.Select(x => new SelectorDataModel
            {
                Id = x.IqamaIssuePlaceId,
                Name = x.NameAR ?? x.NameEN
            }).ToList();
        }
        public List<SelectorDataModel> GetEmployeeDueTypesSelector()
        {
         
            return LookupsContext.EmployeeDueTypes.Select(x => new SelectorDataModel
            {
                Id = x.DueTypeId,
                Name = x.NameAR ?? x.NameEN
            }).ToList();
        }
        public List<SelectorDataModel> GetSponsorTypesSelector()
        {
         
            return LookupsContext.SponsorTypes.Select(x => new SelectorDataModel
            {
                Id = x.SponsorTypeId,
                Name = x.NameAR ?? x.NameEN
            }).ToList();
        }

        public List<SelectorDataModel> GetCurrencySelector()
        {
            SqlParameter[] Params = new SqlParameter[0];

            var result = SQLHelper.SQLQuery<SelectorDataModel>("[Finance].[SP_GetCurrencies]", ConnectionString, Params);
            return result;
        }

        public List<SelectorDataModel> GetRegionIdSelector(int? CountryId = null, int? CityId = null)
        {
            return LookupsContext.Regions.Where(x=>(!CountryId.HasValue || CountryId == x.CountryId)&& (!CityId.HasValue || CityId == x.CityId)).Select(x => new SelectorDataModel
            {
                Id = x.RegionId,
                Name = x.NameAR ?? x.NameEN
            }).ToList();
        }
        public List<SelectorDataModel> GetCitiesSelector(int? CountryId =null)
        {
            SqlParameter[] Params = new SqlParameter[1];
            Params[0] = new SqlParameter("@CountryId", CountryId);
            var result = SQLHelper.SQLQuery<SelectorDataModel>("[Global].[SP_GetCities]", ConnectionString, Params);
            return result;
        }
        public List<SelectorDataModel> GetCountriesSelector()
        {
            var results = LookupsContext.Countries.Select(b => new SelectorDataModel
            {
                Id = b.CountryId,
                Name = b.NameAR,
            }).ToList();
            return results;
        }
        #endregion

        #region Finance Lookups

        public List<SelectorDataModel> GetAccountTypes()
        {
            SqlParameter[] Params = new SqlParameter[0];

            var result = SQLHelper.SQLQuery<SelectorDataModel>("[Finance].[SP_GetAccountTypes]", ConnectionString, Params);
            return result;
        }

        public List<SelectorDataModel> GetActionTypes()
        {
            SqlParameter[] Params = new SqlParameter[0];

            var result = SQLHelper.SQLQuery<SelectorDataModel>("[Finance].[SP_GetActionTypes]", ConnectionString, Params);
            return result;
        }

        public List<SelectorDataModel> GetBankDepositTypes()
        {
            SqlParameter[] Params = new SqlParameter[0];

            var result = SQLHelper.SQLQuery<SelectorDataModel>("[Finance].[SP_GetBankDepositTypes]", ConnectionString, Params);
            return result;
        }

        public List<SelectorDataModel> GetJournalEntryTypes()
        {
            SqlParameter[] Params = new SqlParameter[0];

            var result = SQLHelper.SQLQuery<SelectorDataModel>("[Finance].[SP_GetJournalEntryTypes]", ConnectionString, Params);
            return result;
        }

        public List<SelectorDataModel> GetLedgerTypes()
        {
            SqlParameter[] Params = new SqlParameter[0];

            var result = SQLHelper.SQLQuery<SelectorDataModel>("[Finance].[SP_GetLedgerTypes]", ConnectionString, Params);
            return result;
        }

        public List<SelectorDataModel> GetPaymentTypes()
        {
            SqlParameter[] Params = new SqlParameter[0];

            var result = SQLHelper.SQLQuery<SelectorDataModel>("[Finance].[SP_GetPaymentTypes]", ConnectionString, Params);
            return result;
        }
        
        public List<SelectorDataModel> GetReceiptTypes(string GroupName, int PaymentTypeId)
        {
            SqlParameter[] Params = new SqlParameter[2];
            Params[0] = new SqlParameter("@GroupName", (object)GroupName ?? DBNull.Value);
            Params[1] = new SqlParameter("@PaymentTypeId", (object)PaymentTypeId ?? DBNull.Value);

            var result = SQLHelper.SQLQuery<SelectorDataModel>("[Finance].[SP_GetReceiptTypes]", ConnectionString, Params);
            return result;
        }
        
        public List<SelectorDataModel> GetTaxLookups()
        {
            return LookupsContext.TaxLookups.Select(x => new SelectorDataModel
            {
                Id = x.TaxLookupId,
                Name = x.NameAR ?? x.NameEN
            }).ToList();
        }

        public List<SelectorDataModel> GetMaterialRequestPurposes()
        {
            SqlParameter[] Params = new SqlParameter[0];

            var result = SQLHelper.SQLQuery<SelectorDataModel>("[Inventory].[SP_GetMaterialRequestPurposes]", ConnectionString, Params);
            return result;
        }

        #endregion

        #region HR Lookups

        public List<SelectorDataModel> GetWorkStatusSelector(string Group)
        {
            SqlParameter[] Params = new SqlParameter[1];
            Params[0] = new SqlParameter("@Group", Group);

            var result = SQLHelper.SQLQuery<SelectorDataModel>("[HR].[SP_GetWorkStatus]", ConnectionString, Params);
            return result;
        }

        public List<SelectorDataModel> GetNationalitiesSelector()
        {
            SqlParameter[] Params = new SqlParameter[0];

            var result = SQLHelper.SQLQuery<SelectorDataModel>("[HR].[SP_GetNationalities]", ConnectionString, Params);
            return result;
        }

        public List<SelectorDataModel> GetReligionsSelector()
        {
            SqlParameter[] Params = new SqlParameter[0];

            var result = SQLHelper.SQLQuery<SelectorDataModel>("[HR].[SP_GetReligions]", ConnectionString, Params);
            return result;
        }

        public List<SelectorDataModel> GetSocialStatusSelector()
        {
            SqlParameter[] Params = new SqlParameter[0];

            var result = SQLHelper.SQLQuery<SelectorDataModel>("[HR].[SP_GetSocialStatus]", ConnectionString, Params);
            return result;
        }

        public List<SelectorDataModel> GetVacationTypesSelector()
        {
            SqlParameter[] Params = new SqlParameter[0];

            var result = SQLHelper.SQLQuery<SelectorDataModel>("[HR].[SP_GetVacationTypes]", ConnectionString, Params);
            return result;
        }

        public List<SelectorDataModel> GetEmployeeStatusSelector()
        {
            //return LookupsContext.EmployeeStatus.Select(x => new SelectorDataModel
            //{
            //    Id = x.EmployeeStatusId,
            //    Name = x.StatusNameAR ?? x.StatusNameEN
            //}).ToList();
            return new List<SelectorDataModel>();
        } 
        public List<SelectorDataModel> GetFinancialCustodyTypesSelector()
        {
            return LookupsContext.FinancialCustodyTypes.Select(x => new SelectorDataModel
            {
                Id = x.FinancialCustodyTypeId,
                Name = x.NameAR ?? x.NameEN
            }).ToList();
        }

        #endregion
    }
}
