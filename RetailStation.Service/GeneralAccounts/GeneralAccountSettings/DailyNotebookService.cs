using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.Finance;
using MasterErp.Interface.Common;
using MasterErp.Interface.GeneralAccounts.GeneralAccountSettings;
using MasterErp.Service.Common;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.GeneralAccounts.GeneralAccountSettings
{
    public class DailyNotebookService: IDailyNotebookService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly LookupsDbContext LookupsContext;
        private readonly IConfiguration Configuration;
        private readonly string ConnectionString;
        public DailyNotebookService(DBContext dBContext, ISQLHelper sQLHelper, IConfiguration configuration, LookupsDbContext lookupsContext)
        {
            Context = dBContext; ;
            SQLHelper = sQLHelper;
            Configuration = configuration;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
            LookupsContext = lookupsContext;
        }

        public List<DailyNotebookModel> GetDailyNotebooksData(SearchFilterModel searchModel)
        {

            //SqlParameter[] param = new SqlParameter[2];
            //param[0] = new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value);
            //param[1] = new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value);
            //var dt = SQLHelper.ExecuteDataTable("[Finance].[SP_GetDailyNotebookData]", param, ConnectionString);

            //return dt;

            var ledgerTypes = LookupsContext.LedgerTypes.ToList();

            var query = Context.DailyNotebooks.Select(dailyNoteboook =>
                        new DailyNotebookModel
                        {
                            DailyNotebookId = dailyNoteboook.DailyNotebookId,
                            NameEN = dailyNoteboook.NameEN,
                            NameAR = dailyNoteboook.NameAR,
                            LedgerTypeId = dailyNoteboook.LedgerTypeId,
                            Code = dailyNoteboook.Code,
                            VirtualAccount = dailyNoteboook.VirtualAccount,
                            CreatedBy = dailyNoteboook.CreatedBy,
                            CreatedDate = dailyNoteboook.CreatedDate,
                            ModifiedBy = dailyNoteboook.ModifiedBy,
                            ModifiedDate = dailyNoteboook.ModifiedDate,
                        });

            int totalCount = query.Count();
            if (searchModel.CurrentPage > 0 && searchModel.PageSize > 0)
            {
                int skip = (searchModel.CurrentPage - 1) * searchModel.PageSize;
                query = query.Skip(skip).Take(searchModel.PageSize);
            }

            var pagedResults = query.ToList();
            //pagedResults.ForEach(x => x.TotalCount = totalCount);

            var results = pagedResults.Select(x =>
            {
                var ledgerType = ledgerTypes.FirstOrDefault(l => l.LedgerTypeId == x.LedgerTypeId);
                x.TotalCount = totalCount;
                x.ReceiptLedgerTypeNameEN = ledgerType?.NameEN;
                x.ReceiptLedgerTypeNameAR = ledgerType?.NameAR;

                return x;
            }).ToList();

            return results;
        }
        public ActionsResponseModel CreateNewDailyNotebook(DailyNotebookModel Model)
        {
            try
            {
                var entity = Context.DailyNotebooks.FirstOrDefault(i => i.NameEN == Model.NameEN || i.NameAR == Model.NameAR);
                if (entity != null)
                {
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "هذا الاسم موجود"
                    };
                }

                DailyNotebook tbl = new DailyNotebook();

                tbl.NameAR = Model.NameAR;
                tbl.NameEN = Model.NameEN;
                tbl.LedgerTypeId = Model.LedgerTypeId;
                tbl.Code = Model.Code;
                tbl.VirtualAccount = Model.VirtualAccount;
                tbl.CreatedDate = DateTime.Now;
                tbl.CreatedBy = Model.CreatedBy;

                Context.DailyNotebooks.Add(tbl);
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

        public ActionsResponseModel EditDailyNotebook(int DailyNotebookId, DailyNotebookModel Model)
        {
            try
            {
                var entity = Context.DailyNotebooks.FirstOrDefault(x => x.DailyNotebookId == DailyNotebookId);
                if (entity != null)
                {
                    entity.NameAR = Model.NameAR;
                    entity.NameEN = Model.NameEN;
                    entity.LedgerTypeId = Model.LedgerTypeId;
                    entity.Code = Model.Code;
                    entity.VirtualAccount = Model.VirtualAccount;
                    entity.ModifiedDate = DateTime.Now;
                    entity.ModifiedBy = Model.ModifiedBy;
                    Context.SaveChanges();
                    return new ActionsResponseModel
                    {
                        Message = "تم التعديل  بنجاح"
                    };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Daily notebook not found" };


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

        public ActionsResponseModel DeleteDailyNotebook(int DailyNotebookId)
        {
            try
            {
                var entity = Context.DailyNotebooks.FirstOrDefault(i => i.DailyNotebookId == DailyNotebookId);
                if (entity != null)
                {
                    Context.DailyNotebooks.Remove(entity);
                    Context.SaveChanges();
                    return new ActionsResponseModel
                    {
                        Message = "تم الحذف  بنجاح"
                    };
                }
                else
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "لقد حدث خطأ"
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
    }
}
