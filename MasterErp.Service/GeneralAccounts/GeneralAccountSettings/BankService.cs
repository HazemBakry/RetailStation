using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.Finance;
using MasterErp.Entities.Models.HR;
using MasterErp.Interface.Common;
using MasterErp.Interface.GeneralAccounts.GeneralAccountSettings;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.GeneralAccounts.GeneralAccountSettings
{
    public class BankService : IBankService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly LookupsDbContext LookupsContext;
        private readonly IConfiguration Configuration;
        private readonly string ConnectionString;
        public BankService(DBContext dBContext, ISQLHelper sQLHelper, IConfiguration configuration, LookupsDbContext lookupsContext)
        {
            Context = dBContext; ;
            SQLHelper = sQLHelper;
            Configuration = configuration;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
            LookupsContext = lookupsContext;
        }

        public List<Bank> GetBanksData(SearchFilterModel searchModel)
        {
            var banks = Context.Banks.ToList();

            int totalCount = banks.Count();
            if (searchModel.CurrentPage > 0 && searchModel.PageSize > 0)
            {
                int skip = (searchModel.CurrentPage - 1) * searchModel.PageSize;
                banks = banks.Skip(skip).Take(searchModel.PageSize).ToList();
            }

            var pagedResults = banks.ToList();
            pagedResults.ForEach(x => x.TotalCount = totalCount);
            return pagedResults;
        }

        public ActionsResponseModel CreateNewBank(Bank Model)
        {
            try
            {
                var entity = Context.Banks.FirstOrDefault(i => i.NameEN == Model.NameEN || i.NameAR == Model.NameAR);
                if (entity != null)
                {
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "هذا الاسم موجود"
                    };
                }

                Bank tbl = new Bank();

                tbl.NameAR = Model.NameAR;
                tbl.NameEN = Model.NameEN;
                tbl.CreatedDate = DateTime.Now;
                tbl.CreatedBy = Model.CreatedBy;

                Context.Banks.Add(tbl);
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

        public ActionsResponseModel EditBank(int BankId, Bank Model)
        {
            try
            {
                var entity = Context.Banks.FirstOrDefault(i => i.BankId == BankId);
                if (entity != null)
                {
                    entity.NameAR = Model.NameAR;
                    entity.NameEN = Model.NameEN;
                    entity.ModifiedDate = DateTime.Now;
                    entity.ModifiedBy = Model.ModifiedBy;

                    Context.SaveChanges();

                    return new ActionsResponseModel { Message = "تم تعديل البيانات بنجاح !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "هذا الاسم غير موجود" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }

        public ActionsResponseModel DeleteBank(int BankId)
        {

            try
            {
                var entity = Context.Banks.FirstOrDefault(i => i.BankId == BankId);
                if (entity != null)
                {
                    Context.Remove(entity);
                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "تم الحذف بنجاح !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "هذا الاسم غير موجود" }; ;
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }
    }
}
