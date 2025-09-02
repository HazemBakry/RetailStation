using RetailStation.Entities.Common;
using RetailStation.Entities.Models;
using RetailStation.Entities.Models.HR;
using RetailStation.Interface.Common;
using RetailStation.Interface.GeneralAccounts;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Service.GeneralAccounts
{
    public class LoansFormService: ILoansFormService
    {
        private readonly DBContext Context;
        public LoansFormService(DBContext dBContext)
        {
            Context = dBContext;
        }

        public List<Loan> GetLoansData()
        {
            var results = Context.LoansForms.ToList();
            return results;
        }

        public ActionsResponseModel AddNewLoans(Loan Model)
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

                Loan loanObj = new Loan();

                loanObj.LoanName = Model.LoanName;
                loanObj.LoanAmount = Model.LoanAmount;
                loanObj.Benefit = Model.Benefit;
                //loanObj.Date = Model.Date;
                //loanObj.Duration = Model.Duration;
                //loanObj.AmountDue = Model.AmountDue;
                loanObj.PaymentAmount = Model.PaymentAmount;
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

        public ActionsResponseModel EditLoans(Loan Model)
        {
            try
            {
                var entity = Context.LoansForms.FirstOrDefault(x => x.LoanId == Model.LoanId);
                if (entity != null)
                {
                    entity.LoanName = Model.LoanName;
                    entity.LoanAmount = Model.LoanAmount;
                    //entity.Date = Model.Date;
                    //entity.Bnefit = Model.Bnefit;
                    //entity.Duration = Model.Duration;
                    //entity.AmountDue = Model.AmountDue;
                    //entity.MonthlyInstallment = Model.MonthlyInstallment;
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
