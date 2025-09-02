using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
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
        private readonly LookupsDbContext LookupsContext;

        public TaxCalculationService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration, LookupsDbContext lookupsContext)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
            LookupsContext = lookupsContext;
        }



        public List<TaxCalculationModel> GetTaxCalculationsData(SearchFilterModel searchModel)
        {

            //SqlParameter[] param = new SqlParameter[2];
            //param[0] = new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value);
            //param[1] = new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value);
            //var dt = SQLHelper.ExecuteDataTable("[Finance].[SP_GetTaxCalculationData]", param, ConnectionString);


            var taxLookups = LookupsContext.TaxLookups.ToList();

            var query = Context.TaxCalculations.Select(taxCalculation=> 
                        new TaxCalculationModel
                        {
                            TaxCalculationId = taxCalculation.TaxCalculationId,
                            IsActive = taxCalculation.IsActive,
                            TaxLookupId = taxCalculation.TaxLookupId,
                            TaxScope = taxCalculation.TaxScope,
                            TaxType = taxCalculation.TaxType,
                            Amount = taxCalculation.Amount,
                            NameEN = taxCalculation.NameEN,
                            NameAR = taxCalculation.NameAR,
                            Description = taxCalculation.Description,
                            CreatedBy = taxCalculation.CreatedBy,
                            CreatedDate = taxCalculation.CreatedDate,
                            ModifiedBy = taxCalculation.ModifiedBy,
                            ModifiedDate = taxCalculation.ModifiedDate,
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
                var taxLookup = taxLookups.FirstOrDefault(p => p.TaxLookupId == x.TaxLookupId);
                x.TotalCount = totalCount;
                x.TaxLookupNameEN = taxLookup?.NameEN;
                x.TaxLookupNameAR = taxLookup?.NameAR;
                
                return x;
            }).ToList();

            return results;
        }



        public ActionsResponseModel CreateNewTaxCalculation(TaxCalculationModel Model)
        {
            try
            {
                var entity = Context.TaxCalculations.FirstOrDefault(i => i.NameEN == Model.NameEN || i.NameAR == Model.NameAR);
                if (entity != null)
                {
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "هذا الاسم موجود"
                    };
                }

                TaxCalculation taxObj = new TaxCalculation();

                taxObj.NameEN = Model.NameEN;
                taxObj.NameAR = Model.NameAR;
                taxObj.Description = Model.Description;
                taxObj.TaxLookupId = Model.TaxLookupId;
                taxObj.TaxType = Model.TaxType;
                taxObj.TaxScope = Model.TaxScope;
                taxObj.Amount = Model.Amount;
                taxObj.IsActive = Model.IsActive;
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

        public ActionsResponseModel EditTaxCalculation(int TaxCalculationId, TaxCalculationModel Model)
        {

            try
            {
                var entity = Context.TaxCalculations.FirstOrDefault(x => x.TaxCalculationId == TaxCalculationId);
                if (entity != null)
                {
                    entity.NameEN = Model.NameEN;
                    entity.NameAR = Model.NameAR;
                    entity.Description = Model.Description;
                    entity.TaxLookupId = Model.TaxLookupId;
                    entity.TaxType = Model.TaxType;
                    entity.TaxScope = Model.TaxScope;
                    entity.Amount = Model.Amount;
                    entity.IsActive = Model.IsActive;
                    entity.ModifiedDate = DateTime.Now;
                    entity.ModifiedBy = Model.ModifiedBy;
                    Context.SaveChanges();
                    return new ActionsResponseModel
                    {
                        Message = "تم التعديل  بنجاح"
                    };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Tax Calculation not found" };
               
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



    }
}
