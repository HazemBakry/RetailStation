using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.GeneralAccounts.GeneralAccountSettings;
using MasterErp.Service.Common;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MasterErp.Entities.Models.Finance;

namespace MasterErp.Service.GeneralAccounts.GeneralAccountSettings
{
    public class PaymentTermService : IPaymentTermService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly string ConnectionString;
        public PaymentTermService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
        }

        public List<PaymentTermModel> GetPaymentTermsData(SearchFilterModel searchModel)
        {
            var query = Context.PaymentTerms.Select(x => new PaymentTermModel
            { 
                PaymentTermId = x.PaymentTermId,
                NameEN = x.NameEN,
                NameAR = x.NameAR,
                IsActive = x.IsActive,
                CreatedBy = x.CreatedBy,
                CreatedDate = x.CreatedDate,
                ModifiedBy = x.ModifiedBy,
                ModifiedDate = x.ModifiedDate,

            });

            int totalCount = query.Count();
            if (searchModel.CurrentPage > 0 && searchModel.PageSize > 0)
            {
                int skip = (searchModel.CurrentPage - 1) * searchModel.PageSize;
                query = query.Skip(skip).Take(searchModel.PageSize);
            }

            var pagedResults = query.ToList();
            pagedResults.ForEach(x => x.TotalCount = totalCount);
            return pagedResults;
        }

        public List<PaymentTermDetailsModel> GetPaymentTermDetailsById(int PaymentTermId)
        {
            var results = Context.PaymentTermDetails.Where(i => i.PaymentTermId == PaymentTermId).Select(x=>new PaymentTermDetailsModel
            {
                PaymentTermDetailsId =x.PaymentTermDetailsId,
                PaymentTermId=x.PaymentTermId,
                DueAfterDays=x.DueAfterDays,
                DuePercentage=x.DuePercentage,
                CreatedBy=x.CreatedBy,
                CreatedDate=x.CreatedDate,
                ModifiedBy=x.ModifiedBy,
                ModifiedDate=x.ModifiedDate
            }).ToList();
            return results;
        }

        public ActionsResponseModel ChangePaymentTermStatus(int PaymentTermId,bool IsActive)
        {
            try
            {
                var entity = Context.PaymentTerms.FirstOrDefault(x => x.PaymentTermId == PaymentTermId);
                if (entity != null)
                    entity.IsActive = IsActive;

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

        public ActionsResponseModel CreateNewPaymentTerm(PaymentTermModel Model)
        {
            try
            {
                var entity = Context.PaymentTerms.FirstOrDefault(i => i.NameAR == Model.NameAR || i.NameEN == Model.NameEN);
                if (entity != null)
                {
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "هذا الاسم موجود"
                    };
                }

                PaymentTerm termObj = new PaymentTerm();

                termObj.NameEN = Model.NameEN;
                termObj.NameAR = Model.NameAR;
                termObj.IsActive = Model.IsActive;
                termObj.CreatedDate = DateTime.Now;
                termObj.CreatedBy = Model.CreatedBy;

                Context.PaymentTerms.Add(termObj);
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

        public ActionsResponseModel CreateNewPaymentTermDetails(int PaymentTermId, PaymentTermDetailsModel Model)
        {
            try
            {
                PaymentTermDetails termObj = new PaymentTermDetails();

                termObj.PaymentTermId = PaymentTermId;
                termObj.DuePercentage = Model.DuePercentage;
                termObj.DueAfterDays = Model.DueAfterDays;
                termObj.CreatedDate = DateTime.Now;
                termObj.CreatedBy = Model.CreatedBy;

                Context.PaymentTermDetails.Add(termObj);
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

        public ActionsResponseModel EditPaymentTerm(int PaymentTermId,PaymentTermModel Model)
        {
            try
            {
                var entity = Context.PaymentTerms.FirstOrDefault(x => x.PaymentTermId == PaymentTermId);
                if (entity != null)
                {
                    entity.NameEN = Model.NameEN;
                    entity.NameAR = Model.NameAR;
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
                    return new ActionsResponseModel { IsSuccess = false, Message = "Payment Term not found" };
                
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

        public ActionsResponseModel EditPaymentTermDetails(int PaymentTermDetailsId,PaymentTermDetailsModel Model)
        {
            try
            {
                var entity = Context.PaymentTermDetails.FirstOrDefault(x => x.PaymentTermDetailsId == PaymentTermDetailsId);
                if (entity != null)
                {
                    entity.DuePercentage = Model.DuePercentage;
                    entity.DueAfterDays = Model.DueAfterDays;
                    entity.ModifiedDate = DateTime.Now;
                    entity.ModifiedBy = Model.ModifiedBy;
                    Context.SaveChanges();
                    return new ActionsResponseModel
                    {
                        Message = "تم التعديل  بنجاح"
                    };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "not found" };


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

        public ActionsResponseModel DeletePaymentTerm(int PaymentTermId)
        {
            try
            {
                var entity = Context.PaymentTerms.FirstOrDefault(i => i.PaymentTermId == PaymentTermId);
                var details = Context.PaymentTermDetails.Where(i => i.PaymentTermId == PaymentTermId);
                if (entity != null)
                {
                    Context.PaymentTerms.Remove(entity);
                    if (details.Count() > 0)
                        Context.PaymentTermDetails.RemoveRange(details);
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

        public ActionsResponseModel DeletePaymentTermDetails(int PaymentTermDetailsId)
        {
            try
            {
                var entity = Context.PaymentTermDetails.FirstOrDefault(i => i.PaymentTermDetailsId == PaymentTermDetailsId);
                if (entity != null)
                {
                    Context.PaymentTermDetails.Remove(entity);
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
