using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.GeneralAccounts;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.GeneralAccounts
{
    public class LoansFormService: ILoansFormService
    {
        private readonly DBContext Context;
        public LoansFormService(DBContext dBContext)
        {
            Context = dBContext;
        }

        public List<Loans> GetLoansData()
        {
            var results = Context.LoansForms.ToList();
            return results;
        }

        public ActionsResponseModel AddNewLoans(Loans Model)
        {
            try
            {
                var entity = Context.LoansForms.FirstOrDefault(i => i.LoanName == Model.LoanName);
                if (entity != null)
                {
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "هذا الاسم موجود"
                    };
                }

                Loans loanObj = new Loans();

                loanObj.LoanName = Model.LoanName;
                loanObj.LoanAmount = Model.LoanAmount;
                loanObj.Date = Model.Date;
                loanObj.Bnefit = Model.Bnefit;
                loanObj.Duration = Model.Duration;
                loanObj.AmountDue = Model.AmountDue;
                loanObj.MonthlyInstallment = Model.MonthlyInstallment;
                loanObj.CreatedDate = DateTime.Now;
                loanObj.CreatedBy = Model.CreatedBy;

                Context.LoansForms.Add(loanObj);
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

        public ActionsResponseModel EditLoans(Loans Model)
        {
            try
            {
                var entity = Context.LoansForms.FirstOrDefault(x => x.LoanId == Model.LoanId);
                if (entity != null)
                {
                    entity.LoanName = Model.LoanName;
                    entity.LoanAmount = Model.LoanAmount;
                    entity.Date = Model.Date;
                    entity.Bnefit = Model.Bnefit;
                    entity.Duration = Model.Duration;
                    entity.AmountDue = Model.AmountDue;
                    entity.MonthlyInstallment = Model.MonthlyInstallment;
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

        public ActionsResponseModel DeleteLoans(int LoanId)
        {
            try
            {
                var entity = Context.LoansForms.FirstOrDefault(i => i.LoanId == LoanId);
                if (entity != null)
                {
                    Context.LoansForms.Remove(entity);
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
