using MasterErp.Entities.Common;
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
        private readonly IConfiguration Configuration;
        private readonly string ConnectionString;
        public DailyNotebookService(DBContext dBContext, ISQLHelper sQLHelper, IConfiguration configuration)
        {
            Context = dBContext; ;
            SQLHelper = sQLHelper;
            Configuration = configuration;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
        }

        public DataTable GetDailyNotebookData(FilterModel model)
        {
            SqlParameter[] param = new SqlParameter[2];
            param[0] = new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value);
            param[1] = new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value);
            var dt = SQLHelper.ExecuteDataTable("[Finance].[SP_GetDailyNotebookData]", ConnectionString, param);

            return dt;
        }

        public ActionsResponseModel AddNewDailyNotebook(DailyNotebook Model)
        {
            try
            {
                var entity = Context.DailyNotebooks.FirstOrDefault(i => i.DailyNotebookName == Model.DailyNotebookName);
                if (entity != null)
                {
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "هذا الاسم موجود"
                    };
                }

                DailyNotebook notebookObj = new DailyNotebook();

                notebookObj.DailyNotebookName = Model.DailyNotebookName;
                notebookObj.LeadgerTypeId = Model.LeadgerTypeId;
                notebookObj.Code = Model.Code;
                notebookObj.VirtualAccount = Model.VirtualAccount;
                notebookObj.CreatedDate = DateTime.Now;
                notebookObj.CreatedBy = Model.CreatedBy;

                Context.DailyNotebooks.Add(notebookObj);
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

        public ActionsResponseModel EditDailyNotebook(DailyNotebook Model)
        {
            try
            {
                var entity = Context.DailyNotebooks.FirstOrDefault(x => x.DailyNotebookId == Model.DailyNotebookId);
                if (entity != null)
                {
                    entity.DailyNotebookName = Model.DailyNotebookName;
                    entity.LeadgerTypeId = Model.LeadgerTypeId;
                    entity.Code = Model.Code;
                    entity.VirtualAccount = Model.VirtualAccount;
                    entity.ModifiedDate = DateTime.Now;
                    entity.ModifiedBy = Model.ModifiedBy;
                }

                Context.SaveChanges();
                return new ActionsResponseModel
                {
                    Message = "تم التعديل  بنجاح"
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
