using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.HR;
using MasterErp.Interface.HR;
using MasterErp.Service.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.HR
{
    public class OverTimeService : IOverTimeService
    {
        private readonly DBContext Context;

        public OverTimeService(DBContext context)
        {
            Context = context;
        }


        public List<EmployeeOverTimeDto> GetAllEmployeeOverTime(SearchFilterModel SearchModel)
        {
            var query = from overTime in Context.OverTime
                        join emp in Context.Employees on overTime.EmployeeId equals emp.EmployeeId
                        select new EmployeeOverTimeDto
                        {
                            EmployeeId = overTime.EmployeeId,
                            EmployeeName = emp.FullNameAR,
                            OverTimeId = overTime.OverTimeId,
                            RequestDate = overTime.RequestDate,
                            ExecutionDate = overTime.ExecutionDate,
                            NoHours = overTime.NoHours,
                            OvertimeRatio = overTime.OvertimeRatio,
                            MoneyAmount = overTime.MoneyAmount,
                            Notes = overTime.Notes,
                            WorkflowStatusId = overTime.WorkflowStatusId,
                            IsActive = overTime.IsActive,
                            CreatedBy = overTime.CreatedBy,
                            CreatedDate = overTime.CreatedDate,
                            ModifiedBy = overTime.ModifiedBy,
                            ModifiedDate = overTime.ModifiedDate,
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

        public List<EmployeeOverTimeDto> GetOverTimeByEmployeeId(int EmployeeId, SearchFilterModel SearchModel)
        {

            var query = from overTime in Context.OverTime
                        join emp in Context.Employees on overTime.EmployeeId equals emp.EmployeeId
                        join branch in Context.Branches on emp.BranchId equals branch.BranchId
                        where overTime.EmployeeId == EmployeeId
                        select new EmployeeOverTimeDto
                        {
                            EmployeeId = overTime.EmployeeId,
                            EmployeeName = emp.FullNameAR,
                            OverTimeId = overTime.OverTimeId,
                            BranchName = branch.NameAR,
                            RequestDate = overTime.RequestDate,
                            ExecutionDate = overTime.ExecutionDate,
                            NoHours = overTime.NoHours,
                            OvertimeRatio = overTime.OvertimeRatio,
                            MoneyAmount = overTime.MoneyAmount,
                            Notes = overTime.Notes,
                            IsActive = overTime.IsActive,
                            WorkflowStatusId = overTime.WorkflowStatusId,
                            CreatedBy = overTime.CreatedBy,
                            CreatedDate = overTime.CreatedDate,
                            ModifiedBy = overTime.ModifiedBy,
                            ModifiedDate = overTime.ModifiedDate,
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

        public ActionsResponseModel AddNewEmployeeOverTime(int EmployeeId, EmployeeOverTimeDto model)
        {

            try
            {
                var overTime = new OverTime();

                overTime.EmployeeId = model.EmployeeId;
                overTime.RequestDate = DateTime.Now;
                overTime.ExecutionDate = model.ExecutionDate;
                overTime.NoHours = model.NoHours;
                overTime.OvertimeRatio = model.OvertimeRatio;
                overTime.MoneyAmount = model.MoneyAmount;
                overTime.Notes = model.Notes;
                overTime.IsActive = model.IsActive;
                overTime.WorkflowStatusId = (int)WorkflowStatus.Pending;

                overTime.CreatedBy = model.CreatedBy;
                overTime.CreatedDate = DateTime.Now;


                Context.OverTime.Add(overTime);
                var result = Context.SaveChanges();


                return new ActionsResponseModel { Message = "OverTime Added Successfly !" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }

        public ActionsResponseModel EditEmployeeOverTime(int EmployeeId, EmployeeOverTimeDto model)
        {

            try
            {
                var overTime = Context.OverTime.FirstOrDefault(i => i.OverTimeId == model.OverTimeId);
                if (overTime != null)
                {
                    overTime.RequestDate = DateTime.Now;
                    overTime.ExecutionDate = model.ExecutionDate;
                    overTime.NoHours = model.NoHours;
                    overTime.OvertimeRatio = model.OvertimeRatio;
                    overTime.MoneyAmount = model.MoneyAmount;
                    overTime.Notes = model.Notes;
                    overTime.IsActive = model.IsActive;
                    overTime.WorkflowStatusId = model.WorkflowStatusId;
                    overTime.ModifiedBy = model.ModifiedBy;
                    overTime.ModifiedDate = DateTime.Now;

                    Context.SaveChanges();


                    return new ActionsResponseModel { Message = "OverTime Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "OverTime not found" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }


        public ActionsResponseModel DeleteEmployeeOverTime(int OverTimeId)
        {

            try
            {
                var overTime = Context.OverTime.FirstOrDefault(i => i.OverTimeId == OverTimeId);
                if (overTime != null)
                {
                    Context.Remove(overTime);
                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "OverTime deleted successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "OverTime not found" }; ;
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }

        public ActionsResponseModel ApproveEmployeeOverTime(bool isApproved, List<int> overTimeIds)
        {
            try
            {
                if (overTimeIds == null || !overTimeIds.Any())
                {
                    return new ActionsResponseModel { IsSuccess = false, Message = "No overTime IDs provided." };
                }

                var overTimes = Context.OverTime.Where(i => overTimeIds.Contains(i.OverTimeId)).ToList();

                if (!overTimes.Any())
                {
                    return new ActionsResponseModel { IsSuccess = false, Message = "No matching overTimes found." };
                }

                int newStatus = isApproved ? (int)WorkflowStatus.Approved : (int)WorkflowStatus.Rejected;

                foreach (var overTime in overTimes)
                {
                    overTime.WorkflowStatusId = newStatus;
                }

                Context.SaveChanges();

                return new ActionsResponseModel
                {
                    IsSuccess = true,
                    Message = isApproved ? "OverTime approved successfully!" : "OverTime rejected successfully!"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = ex.InnerException?.Message ?? ex.Message
                };
            }
        }
    }
}
