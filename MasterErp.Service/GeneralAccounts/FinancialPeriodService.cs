using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.DTOs.HR;
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


        public List<FinancialPeriodModel> GetFinancialPeriodsData(SearchFilterModel SearchModel)
        {

            var query = Context.FinancialPeriods.Select(period => new FinancialPeriodModel
            {
                FinancialPeriodId = period.FinancialPeriodId,
                NameAR = period.NameAR,
                NameEN = period.NameEN,
                Code = period.Code,
                StartDate = period.StartDate,
                EndDate = period.EndDate,
                IsLocked = period.IsLocked,
                IsActive = period.IsActive,
                Notes = period.Notes,
            });
            int totalCount = query.Count();
            if (SearchModel.CurrentPage > 0 && SearchModel.PageSize > 0)
            {
                int skip = (SearchModel.CurrentPage - 1) * SearchModel.PageSize;
                query = query.OrderByDescending(e => e.NameEN).Skip(skip).Take(SearchModel.PageSize);
            }

            var results = query.ToList();
            results.ForEach(x => x.TotalCount = totalCount);
            return results;

        }



        public ActionsResponseModel CreateNewFinancialPeriod(FinancialPeriodModel Model)
        {
            try
            {
                FinancialPeriod tbl = new FinancialPeriod();

                tbl.CreatedDate = DateTime.Now;
                tbl.CreatedBy = Model.CreatedBy;
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
                    Message = "تم الحفظ  بنجاح"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = ex.Message
                };
            }
        }

        public ActionsResponseModel EditFinancialPeriod(int FinancialPeriodId, FinancialPeriodModel Model)
        {

            try
            {
                var entity = Context.FinancialPeriods.FirstOrDefault(i => i.FinancialPeriodId == FinancialPeriodId);
                if (entity != null)
                {

                    entity.ModifiedDate = DateTime.Now;
                    entity.ModifiedBy = Model.ModifiedBy;
                    entity.Code = Model.Code;
                    entity.IsActive = Model.IsActive;
                    entity.IsLocked = Model.IsLocked;
                    entity.NameAR = Model.NameAR;
                    entity.NameEN = Model.NameEN;
                    entity.Notes = Model.Notes;
                    entity.StartDate = Model.StartDate;
                    entity.EndDate = Model.EndDate;

                    Context.SaveChanges();


                    return new ActionsResponseModel { Message = "Financial Period Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Financial period not found" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }


        public ActionsResponseModel DeleteFinancialPeriod(int FinancialPeriodId)
        {

            try
            {
                var entity = Context.FinancialPeriods.FirstOrDefault(i => i.FinancialPeriodId == FinancialPeriodId);
                if (entity != null)
                {
                    Context.Remove(entity);
                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Financial period deleted successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Financial period not found" }; ;
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }


    }
}
