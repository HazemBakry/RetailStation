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
    public class TaxCalculationService : ITaxCalculationService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly string ConnectionString;
        public TaxCalculationService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
        }

        public DataTable GetTaxCalculationData(FilterModel model)
        {
            SqlParameter[] param = new SqlParameter[2];
            param[0] = new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value);
            param[1] = new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value);
            var dt = SQLHelper.ExecuteDataTable("[Finance].[SP_GetTaxCalculationData]", param, ConnectionString);

            return dt;
        }

        public List<TaxLookup> GetTaxLookups()
        {
            var results = Context.TaxLookups.ToList();
            return results;
        }

        public ActionsResponseModel ChangeTaxCalculationStatus(int TaxCalculationId, bool IsActive)
        {
            try
            {
                var entity = Context.TaxCalculations.FirstOrDefault(x => x.TaxCalculationId == TaxCalculationId);
                if (entity != null)
                {
                    entity.IsActive = IsActive;
                }

                Context.SaveChanges();
                return new ActionsResponseModel
                {
                    Message = "تم التعديل  الحالة بنجاح"
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

        public ActionsResponseModel AddNewTaxCalculation(TaxCalculation Model)
        {
            try
            {
                var entity = Context.TaxCalculations.FirstOrDefault(i => i.TaxCalculationName == Model.TaxCalculationName);
                if (entity != null)
                {
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "هذا الاسم موجود"
                    };
                }

                TaxCalculation taxObj = new TaxCalculation();

                taxObj.TaxCalculationName = Model.TaxCalculationName;
                taxObj.Description = Model.Description;
                taxObj.TaxLookupId = Model.TaxLookupId;
                taxObj.TaxType = Model.TaxType;
                taxObj.TaxScope = Model.TaxScope;
                taxObj.Amount = Model.Amount;
                taxObj.IsActive = true;
                taxObj.CreatedDate = DateTime.Now;
                taxObj.CreatedBy = Model.CreatedBy;

                Context.TaxCalculations.Add(taxObj);
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

        public ActionsResponseModel EditTaxCalculation(TaxCalculation Model)
        {
            try
            {
                var entity = Context.TaxCalculations.FirstOrDefault(x => x.TaxCalculationId == Model.TaxCalculationId);
                if (entity != null)
                {
                    entity.TaxCalculationName = Model.TaxCalculationName;
                    entity.Description = Model.Description;
                    entity.TaxLookupId = Model.TaxLookupId;
                    entity.TaxType = Model.TaxType;
                    entity.TaxScope = Model.TaxScope;
                    entity.Amount = Model.Amount;
                    entity.IsActive = true;
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

        public ActionsResponseModel DeleteTaxCalculation(int TaxCalculationId)
        {
            try
            {
                var entity = Context.TaxCalculations.FirstOrDefault(i => i.TaxCalculationId == TaxCalculationId);
                if (entity != null)
                {
                    Context.TaxCalculations.Remove(entity);
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
