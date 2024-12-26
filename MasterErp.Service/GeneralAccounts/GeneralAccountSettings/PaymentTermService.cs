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

        public List<PaymentTerm> GetPaymentTermsData()
        {
            var results = Context.PaymentTerms.ToList();
            return results;
        }

        public List<PaymentTermDetail> GetPaymentTermDetailsById(int PaymentTermId)
        {
            var results = Context.PaymentTermDetails.Where(i => i.PaymentTermId == PaymentTermId).ToList();
            return results;
        }

        public ActionsResponseModel ChangePaymentTermStatus(bool IsActive, int PaymentTermId)
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

        public ActionsResponseModel AddNewPaymentTerm(PaymentTerm Model)
        {
            try
            {
                var entity = Context.PaymentTerms.FirstOrDefault(i => i.PaymentTermName == Model.PaymentTermName);
                if(entity != null)
                {
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "هذا الاسم موجود"
                    };
                }

                PaymentTerm termObj = new PaymentTerm();

                termObj.PaymentTermName = Model.PaymentTermName;
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

        public ActionsResponseModel AddNewPaymentTermDetails(PaymentTermDetail Model)
        {
            try
            {
                PaymentTermDetail termObj = new PaymentTermDetail();

                termObj.PaymentTermId = Model.PaymentTermId;
                termObj.DuePercentage = Model.DuePercentage;
                termObj.AfterDays = Model.AfterDays;
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

        public ActionsResponseModel EditPaymentTerm(PaymentTerm Model)
        {
            try
            {
                var entity = Context.PaymentTerms.FirstOrDefault(x => x.PaymentTermId == Model.PaymentTermId);
                if (entity != null)
                {
                    entity.PaymentTermName = Model.PaymentTermName;
                    entity.IsActive = Model.IsActive;
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

        public ActionsResponseModel EditPaymentTermDetails(PaymentTermDetail Model)
        {
            try
            {
                var entity = Context.PaymentTermDetails.FirstOrDefault(x => x.PaymentTermDetailId == Model.PaymentTermDetailId);
                if (entity != null)
                {
                    entity.DuePercentage = Model.DuePercentage;
                    entity.AfterDays = Model.AfterDays;
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

        public ActionsResponseModel DeletePaymentTerm(int PaymentTermId)
        {
            try
            {
                var entity = Context.PaymentTerms.FirstOrDefault(i => i.PaymentTermId == PaymentTermId);
                if (entity != null)
                {
                    Context.PaymentTerms.Remove(entity);
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

        public ActionsResponseModel DeletePaymentTermDetails(int PaymentTermDetailId)
        {
            try
            {
                var entity = Context.PaymentTermDetails.FirstOrDefault(i => i.PaymentTermDetailId == PaymentTermDetailId);
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
