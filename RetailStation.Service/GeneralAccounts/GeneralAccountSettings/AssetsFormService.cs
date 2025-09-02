using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.Finance;
using MasterErp.Interface.Common;
using MasterErp.Interface.GeneralAccounts.GeneralAccountSettings;
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
    public class AssetsFormService: IAssetsFormService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly string ConnectionString;
        public AssetsFormService(DBContext dBContext, ISQLHelper sQLHelper, IConfiguration configuration)
        {
            Context = dBContext;
            SQLHelper = sQLHelper;
            Configuration = configuration;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
        }

        public DataTable GetAssetsFormData(FilterModel model)
        {
            SqlParameter[] param = new SqlParameter[2];
            param[0] = new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value);
            param[1] = new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value);
            var dt = SQLHelper.ExecuteDataTable("[Finance].[SP_GetAssetsFormData]", param, ConnectionString);
            return dt;
        }

        public ActionsResponseModel AddNewAssetsForm(AssetsForm Model)
        {
            try
            {
                var entity = Context.AssetsForms.FirstOrDefault(i => i.AssetsFormName == Model.AssetsFormName);
                if (entity != null)
                {
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "هذا الاسم موجود"
                    };
                }

                AssetsForm assetObj = new AssetsForm();

                assetObj.AssetsFormName = Model.AssetsFormName;
                assetObj.Method = Model.Method;
                assetObj.AccountTreeId = Model.AccountTreeId;
                assetObj.CostTreeId = Model.CostTreeId;
                assetObj.DurationTxt = Model.DurationTxt;
                assetObj.DurationCount = Model.DurationCount;
                assetObj.Calculation = Model.Calculation;
                assetObj.CreatedDate = DateTime.Now;
                assetObj.CreatedBy = Model.CreatedBy;

                Context.AssetsForms.Add(assetObj);
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

        public ActionsResponseModel EditAssetsForm(AssetsForm Model)
        {
            try
            {
                var entity = Context.AssetsForms.FirstOrDefault(x => x.AssetsFormId == Model.AssetsFormId);
                if (entity != null)
                {
                    entity.AssetsFormName = Model.AssetsFormName;
                    entity.Method = Model.Method;
                    entity.AccountTreeId = Model.AccountTreeId;
                    entity.CostTreeId = Model.CostTreeId;
                    entity.DurationTxt = Model.DurationTxt;
                    entity.DurationCount = Model.DurationCount;
                    entity.Calculation = Model.Calculation;
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

        public ActionsResponseModel DeleteAssetsForm(int AssetsFormId)
        {
            try
            {
                var entity = Context.AssetsForms.FirstOrDefault(i => i.AssetsFormId == AssetsFormId);
                if (entity != null)
                {
                    Context.AssetsForms.Remove(entity);
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
