using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.Finance;
using MasterErp.Interface.Common;
using MasterErp.Interface.GeneralAccounts;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.GeneralAccounts
{
    public class FinancialPeriodService : IFinancialPeriodService
    {


        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;

        private string ConnectionString
        {
            get
            {
                return Configuration.GetConnectionString("DBConnection");
            }
        }

        public FinancialPeriodService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
        }


        public PagedResponseModel<FinancialPeriod> GetFinancialPeriodsData(FilterModel Model)
        {
            int totalCount = Context.FinancialPeriods.Count();

            int skip = (Model.CurrentPage - 1) * Model.PageSize;

            var data = Context.FinancialPeriods
                .OrderByDescending(e => e.NameEN)
                .Skip(skip)
                .Take(Model.PageSize)
            .ToList();

            return new PagedResponseModel<FinancialPeriod>
            {
                TotalCount = totalCount,
                Results = data,
                CurrentPage = Model.CurrentPage,
                PageSize = Model.PageSize
            };
        }



        public ActionsResponseModel CreateNewFinancialPeriod(FinancialPeriodModel Model)
        {
            try
            {
                FinancialPeriod tbl = new FinancialPeriod();

                tbl.CreateDate = DateTime.Now;
                tbl.CreatedBy = string.Empty;
                tbl.Code = Model.Code;
                tbl.IsActive = Model.IsActive;
                tbl.IsLocked = Model.IsLocked;
                tbl.NameAR = Model.NameAR;
                tbl.NameEN = Model.NameEN;
                tbl.Notes = Model.Notes;
                tbl.StartDate = Model.StartDate;
                tbl.EndDate = Model.EndDate;

                Context.FinancialPeriods.Add(tbl);
                Context.SaveChanges();


                return new ActionsResponseModel
                {
                    Status = 1,
                    Message = "تم الحفظ  بنجاح"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    Status = 0,
                    Message = ex.Message
                };
            }
        }

    }
}
