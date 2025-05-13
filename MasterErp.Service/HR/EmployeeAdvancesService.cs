using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Common.SQLTabeType;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.HR;
using MasterErp.Interface.Common;
using MasterErp.Interface.HR;
using MasterErp.Service.Common;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.HR
{
    public class EmployeeAdvancesService : IEmployeeAdvancesService
    {
        private DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly ISharedFilterService sharedFilterService;

        public EmployeeAdvancesService(DBContext Context, ISQLHelper SQLHelper, ISharedFilterService sharedFilterService)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.sharedFilterService = sharedFilterService;
        }



        public List<EmployeeAdvanceModel> GetEmployeeAdvancesData(SearchFilterModel SearchModel, int? EmployeeId = null, int? ManagerId = null)
        {

            var FilterListTable = sharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);
            SqlParameter[] param = new SqlParameter[5];

            param[0] = new SqlParameter("@EmployeeId", EmployeeId);
            param[1] = new SqlParameter("@ManagerId", ManagerId);
            param[2] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            param[3] = new SqlParameter("@PageSize", SearchModel.PageSize);
            param[4] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[4].Value = FilterListTable;

            var result = SQLHelper.SQLQuery<EmployeeAdvanceModel>("[HR].[SP_GetEmployeeAdvancesData]", null, param);
            return result;


            //var query = from advance in Context.Advances
            //            join emp in Context.Employees on advance.EmployeeId equals emp.EmployeeId
            //            join advanceType in Context.AdvanceTypes on advance.AdvanceTypeId equals advanceType.AdvanceTypeId
            //            where (!EmployeeId.HasValue || advance.EmployeeId == EmployeeId)
            //                    && (!ManagerId.HasValue || emp.ManagerId == ManagerId)
            //            select new EmployeeAdvanceModel
            //            {
            //                EmployeeId = advance.EmployeeId,
            //                EmployeeName = emp.FullNameAR,
            //               EmployeeAdvanceId = advance.AdvanceId,
            //                AdvanceTypeId = advance.AdvanceTypeId,
            //                AdvanceTypeName = advanceType.NameEN,
            //                PaymentFromDate = advance.PaymentFromDate,
            //                PaymentToDate = advance.PaymentToDate,
            //                AdvanceAmount = advance.AdvanceAmount,
            //                PaymentAmount = advance.PaymentAmount,
            //                Notes = advance.Notes,
            //                IsApproved = advance.IsApproved,
            //                CreatedBy = advance.CreatedBy,
            //                CreatedDate = advance.CreatedDate,
            //                ModifiedBy = advance.ModifiedBy,
            //                ModifiedDate = advance.ModifiedDate,
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
        }
        public List<AdvancePaymentModel> GetAdvancePaymentsData(SearchFilterModel SearchModel, int? EmployeeId = null, int? ManagerId = null)
        {

            var FilterListTable = sharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);
            SqlParameter[] param = new SqlParameter[5];

            param[0] = new SqlParameter("@EmployeeId", EmployeeId);
            param[1] = new SqlParameter("@ManagerId", ManagerId);
            param[2] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            param[3] = new SqlParameter("@PageSize", SearchModel.PageSize);
            param[4] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[4].Value = FilterListTable;

            var result = SQLHelper.SQLQuery<AdvancePaymentModel>("[HR].[SP_GetEmployeeAdvancePaymentsData]", null, param);
            return result;
        }

        public List<EmployeeAdvanceModel> GetAdvancesByEmployeeId(int EmployeeId, SearchFilterModel SearchModel)
        {

            //var query = from advance in Context.Advances
            //            join emp in Context.Employees on advance.EmployeeId equals emp.EmployeeId
            //            join advanceType in Context.AdvanceTypes on advance.AdvanceTypeId equals advanceType.AdvanceTypeId
            //            where advance.EmployeeId == EmployeeId
            //            select new EmployeeAdvanceModel
            //            {
            //                EmployeeId = advance.EmployeeId,
            //                EmployeeName = emp.FullNameAR,
            //               EmployeeAdvanceId = advance.AdvanceId,
            //                AdvanceTypeId = advance.AdvanceTypeId,
            //                AdvanceTypeName = advanceType.NameEN,
            //                PaymentFromDate = advance.PaymentFromDate,
            //                PaymentToDate = advance.PaymentToDate,
            //                AdvanceAmount = advance.AdvanceAmount,
            //                PaymentAmount = advance.PaymentAmount,
            //                Notes = advance.Notes,
            //                IsApproved = advance.IsApproved,
            //                CreatedBy = advance.CreatedBy,
            //                CreatedDate = advance.CreatedDate,
            //                ModifiedBy = advance.ModifiedBy,
            //                ModifiedDate = advance.ModifiedDate,
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

            return GetEmployeeAdvancesData(SearchModel, EmployeeId);
        }

        public ActionsResponseModel AddNewEmployeeAdvance(int EmployeeId, EmployeeAdvanceModel model)
        {

            try
            {
                var advance = new EmployeeAdvance();

                advance.EmployeeId = EmployeeId;
                advance.AdvanceName = string.Empty;
                advance.AdvanceTypeId = model.AdvanceTypeId;
                advance.PaymentFromDate = model.PaymentFromDate;
                advance.PaymentToDate = CalcAdvancePaymentToDate(model.AdvanceAmount, model.PaymentAmount, model.PaymentFromDate);
                advance.AdvanceAmount = model.AdvanceAmount;
                advance.PaymentAmount = model.PaymentAmount;
                advance.Notes = model.Notes;
                advance.WorkflowStatusId = model.WorkflowStatusId;
                advance.CreatedBy = model.CreatedBy;
                advance.CreatedDate = DateTime.Now;

                Context.EmployeeAdvances.Add(advance);
                var result = Context.SaveChanges();
                //CreateAdvancePayments(advance);

                return new ActionsResponseModel { Message = "Advance Added Successfly !" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }
        public void CreateAdvancePayments(EmployeeAdvance advance)
        {
            var oldPayments = Context.AdvancePayments
                                    .Where(p => p.EmployeeAdvanceId == advance.EmployeeAdvanceId)
                                    .ToList();

            if (oldPayments.Any())
            {
                Context.AdvancePayments.RemoveRange(oldPayments);
                Context.SaveChanges();
            }

            var totalMonths = ((advance.PaymentToDate.Year - advance.PaymentFromDate.Year) * 12)
                              + advance.PaymentToDate.Month - advance.PaymentFromDate.Month + 1;

            if (totalMonths <= 0)
                throw new InvalidOperationException("Invalid date range: PaymentToDate must be after PaymentFromDate.");

            var monthlyPayment = Math.Round(advance.AdvanceAmount / totalMonths, 2);

            var payments = new List<AdvancePayment>();

            for (int i = 0; i < totalMonths; i++)
            {
                var executionDate = advance.PaymentFromDate.AddMonths(i);

                payments.Add(new AdvancePayment
                {
                    EmployeeAdvanceId = advance.EmployeeAdvanceId,
                    MoneyAmount = monthlyPayment,
                    ExecutionDate = executionDate,
                    WorkflowStatusId = (int)PaymentWorkflowStatus.UnPaid,
                    Notes = $"Installment {i + 1} of {totalMonths}",
                    CreatedBy = advance.CreatedBy,
                    CreatedDate = DateTime.Now
                });
            }

            Context.AdvancePayments.AddRange(payments);
            Context.SaveChanges();
        }

        public ActionsResponseModel EditEmployeeAdvance(int EmployeeId, EmployeeAdvanceModel model)
        {

            try
            {
                var advance = Context.EmployeeAdvances.FirstOrDefault(i => i.EmployeeAdvanceId == model.EmployeeAdvanceId);
                if (advance != null)
                {
                    advance.AdvanceTypeId = model.AdvanceTypeId;
                    advance.PaymentFromDate = model.PaymentFromDate;
                    advance.PaymentToDate = CalcAdvancePaymentToDate(model.AdvanceAmount, model.PaymentAmount, model.PaymentFromDate);
                    advance.AdvanceAmount = model.AdvanceAmount;
                    advance.PaymentAmount = model.PaymentAmount;
                    advance.Notes = model.Notes;
                    advance.WorkflowStatusId = model.WorkflowStatusId;
                    advance.ModifiedBy = model.ModifiedBy;
                    advance.ModifiedDate = DateTime.Now;

                    Context.SaveChanges();


                    return new ActionsResponseModel { Message = "Advance Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Advance not found" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }

        public ActionsResponseModel ApproveEmployeeAdvance(int EmployeeAdvanceId , bool IsApproved)
        {

            try
            {
                var advance = Context.EmployeeAdvances.FirstOrDefault(i => i.EmployeeAdvanceId == EmployeeAdvanceId);
                if (advance != null)
                {
                    advance.WorkflowStatusId = IsApproved ? (int)HRWorkflowStatus.Approved: (int)HRWorkflowStatus.Rejected;
                    advance.ModifiedBy = string.Empty;
                    advance.ModifiedDate = DateTime.Now;
                    Context.SaveChanges();
                    if(IsApproved)
                    {
                        CreateAdvancePayments(advance);
                    }
                    return new ActionsResponseModel { Message = "Advance status changed successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Advance not found" }; ;
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }
        public ActionsResponseModel DeleteEmployeeAdvance(int EmployeeAdvanceId)
        {

            try
            {
                var advance = Context.EmployeeAdvances.FirstOrDefault(i => i.EmployeeAdvanceId == EmployeeAdvanceId);
                if (advance != null)
                {
                    Context.Remove(advance);
                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Advance deleted successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Advance not found" }; ;
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }

        public List<SelectorDataModel> GetAdvanceTypesSelector()
        {
            var results = Context.AdvanceTypes.Select(b => new SelectorDataModel
            {
                Id = b.AdvanceTypeId,
                Name = b.NameAR,
            }).ToList();
            return results;
        }

        private DateTime CalcAdvancePaymentToDate(double AdvanceAmount, double MonthelyPaymentAmount, DateTime PaymentFromDate)
        {
            double remainingAmount = AdvanceAmount;
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
        private List<(DateTime PaymentDate, double PaymentAmount)> GetAdvancePaymentSchedule(double AdvanceAmount, double PaymentAmount, DateTime PaymentFromDate)
        {
            List<(DateTime PaymentDate, double PaymentAmount)> paymentSchedule = new List<(DateTime PaymentDate, double PaymentAmount)>();
            double remainingAmount = AdvanceAmount;
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
