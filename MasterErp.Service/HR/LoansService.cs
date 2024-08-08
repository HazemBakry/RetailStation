using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.HR;
using MasterErp.Interface.HR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.HR
{
    public class LoansService : ILoansService 
    {
        private DBContext Context;
        public LoansService(DBContext context)
        {
            Context = context;
        }



        public List<EmployeeLoanDto> GetAllEmployeeLoans(SearchFilterModel SearchModel,int? EmployeeId=null,int? ManagerId=null)
        {
            var query = from loan in Context.Loans
                        join emp in Context.Employees on loan.EmployeeId equals emp.EmployeeId
                        join loanType in Context.LoanTypes on loan.LoanTypeId equals loanType.LoanTypeId
                        where (!EmployeeId.HasValue || loan.EmployeeId == EmployeeId ) 
                                && (!ManagerId.HasValue||emp.ManagerId == ManagerId)
                        select new EmployeeLoanDto
                        {
                            EmployeeId = loan.EmployeeId,
                            EmployeeName = emp.FullNameEN,
                            LoanId = loan.LoanId,
                            LoanTypeId = loan.LoanTypeId,
                            LoanTypeName = loanType.NameEN,
                            PaymentFromDate = loan.PaymentFromDate,
                            PaymentToDate = loan.PaymentToDate,
                            LoanAmount = loan.LoanAmount,
                            PaymentAmount = loan.PaymentAmount,
                            Notes = loan.Notes,
                            IsApproved = loan.IsApproved,
                            CreatedBy = loan.CreatedBy,
                            CreatedDate = loan.CreatedDate,
                            ModifiedBy = loan.ModifiedBy,
                            ModifiedDate = loan.ModifiedDate,
                        };
            int totalCount = query.Count();
            if (SearchModel.CurrentPage > 0 && SearchModel.PageSize > 0)
            {
                int skip = (SearchModel.CurrentPage - 1) * SearchModel.PageSize;
                query = query.Skip(skip).Take(SearchModel.PageSize);
            }

            var results = query.ToList();
            results.ForEach(x => x.TotalCount = totalCount);
            return results;
        }

        public List<EmployeeLoanDto> GetLoansByEmployeeId(int EmployeeId, SearchFilterModel SearchModel)
        {

            //var query = from loan in Context.Loans
            //            join emp in Context.Employees on loan.EmployeeId equals emp.EmployeeId
            //            join loanType in Context.LoanTypes on loan.LoanTypeId equals loanType.LoanTypeId
            //            where loan.EmployeeId == EmployeeId
            //            select new EmployeeLoanDto
            //            {
            //                EmployeeId = loan.EmployeeId,
            //                EmployeeName = emp.FullNameEN,
            //                LoanId = loan.LoanId,
            //                LoanTypeId = loan.LoanTypeId,
            //                LoanTypeName = loanType.NameEN,
            //                PaymentFromDate = loan.PaymentFromDate,
            //                PaymentToDate = loan.PaymentToDate,
            //                LoanAmount = loan.LoanAmount,
            //                PaymentAmount = loan.PaymentAmount,
            //                Notes = loan.Notes,
            //                IsApproved = loan.IsApproved,
            //                CreatedBy = loan.CreatedBy,
            //                CreatedDate = loan.CreatedDate,
            //                ModifiedBy = loan.ModifiedBy,
            //                ModifiedDate = loan.ModifiedDate,
            //            };
            //int totalCount = query.Count();
            //if (SearchModel.CurrentPage > 0 && SearchModel.PageSize > 0)
            //{
            //    int skip = (SearchModel.CurrentPage - 1) * SearchModel.PageSize;
            //    query = query.Skip(skip).Take(SearchModel.PageSize);
            //}

            //var results = query.ToList();
            //results.ForEach(x => x.TotalCount = totalCount);
            //return results;

            return GetAllEmployeeLoans(SearchModel, EmployeeId);
        }

        public ActionsResponseModel AddNewEmployeeLoan(int EmployeeId, EmployeeLoanDto model)
        {

            try
            {
                var loan = new Loan();

                loan.EmployeeId = EmployeeId;
                loan.LoanTypeId = model.LoanTypeId;
                loan.PaymentFromDate = model.PaymentFromDate;
                loan.PaymentToDate = CalcLoanPaymentToDate(model.LoanAmount, model.PaymentAmount, model.PaymentFromDate);
                loan.LoanAmount = model.LoanAmount;
                loan.PaymentAmount = model.PaymentAmount;
                loan.Notes = model.Notes;
                //loan.IsApproved = model.IsApproved;
                loan.CreatedBy = model.CreatedBy;
                loan.CreatedDate = DateTime.Now;

                Context.Loans.Add(loan);
                var result = Context.SaveChanges();


                return new ActionsResponseModel { Message = "Loan Added Successfly !" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }

        public ActionsResponseModel EditEmployeeLoan(int EmployeeId, EmployeeLoanDto model)
        {

            try
            {
                var loan = Context.Loans.FirstOrDefault(i => i.LoanId == model.LoanId);
                if (loan != null)
                {
                    loan.LoanTypeId = model.LoanTypeId;
                    loan.PaymentFromDate = model.PaymentFromDate;
                    loan.PaymentToDate = CalcLoanPaymentToDate(model.LoanAmount, model.PaymentAmount, model.PaymentFromDate);
                    loan.LoanAmount = model.LoanAmount;
                    loan.PaymentAmount = model.PaymentAmount;
                    loan.Notes = model.Notes;
                    //loan.IsApproved = model.IsApproved;
                    loan.ModifiedBy = model.ModifiedBy;
                    loan.ModifiedDate = DateTime.Now;

                    Context.SaveChanges();


                    return new ActionsResponseModel { Message = "Loan Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Loan not found" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }


        public ActionsResponseModel DeleteEmployeeLoan(int LoanId)
        {

            try
            {
                var loan = Context.Loans.FirstOrDefault(i => i.LoanId == LoanId);
                if (loan != null)
                {
                    Context.Remove(loan);
                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Loan deleted successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Loan not found" }; ;
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }
        public ActionsResponseModel ApproveEmployeeLoan(int LoanId, int EmployeeId, bool ApproveStatus)
        {

            try
            {
                var loan = Context.Loans.FirstOrDefault(i => i.LoanId == LoanId&&i.EmployeeId==EmployeeId);
                if (loan != null)
                {
                    loan.IsApproved = ApproveStatus;
                    loan.ModifiedBy = string.Empty;
                    loan.ModifiedDate = DateTime.Now;

                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Loan approved successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Loan not found" }; ;
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }

        public List<SelectorDataModel> GetLoanTypesSelector()
        {
            var results = Context.LoanTypes.Select(b => new SelectorDataModel
            {
                Id = b.LoanTypeId,
                Name = b.NameEN,
            }).ToList();
            return results;
        }

        private DateTime CalcLoanPaymentToDate(double LoanAmount, double MonthelyPaymentAmount, DateTime PaymentFromDate)
        {
            double remainingAmount = LoanAmount;
            DateTime paymentDate = PaymentFromDate;

            while (remainingAmount > 0)
            {
                remainingAmount -= MonthelyPaymentAmount;
                if (remainingAmount > 0)
                {
                    paymentDate = paymentDate.AddMonths(1);
                }
            }

            return paymentDate;
        }
        private List<(DateTime PaymentDate, double PaymentAmount)> GetLoanPaymentSchedule(double LoanAmount, double PaymentAmount, DateTime PaymentFromDate)
        {
            List<(DateTime PaymentDate, double PaymentAmount)> paymentSchedule = new List<(DateTime PaymentDate, double PaymentAmount)>();
            double remainingAmount = LoanAmount;
            DateTime paymentDate = PaymentFromDate;

            while (remainingAmount > 0)
            {
                double currentPaymentAmount = Math.Min(PaymentAmount, remainingAmount);
                paymentSchedule.Add((paymentDate, currentPaymentAmount));
                remainingAmount -= currentPaymentAmount;
                paymentDate = paymentDate.AddMonths(1);
            }

            return paymentSchedule;
        }
    }
}
