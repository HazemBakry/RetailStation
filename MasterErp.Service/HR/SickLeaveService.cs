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
    public class SickLeaveService : ISickLeaveService
    {
        private readonly DBContext Context;

        public SickLeaveService(DBContext context)
        {
            Context = context;
        }

        public List<EmployeeSickLeaveDto> GetAllEmployeeSickLeaves(SearchFilterModel SearchModel)
        {
            var query = from sickLeave in Context.SickLeaves
                        join emp in Context.Employees on sickLeave.EmployeeId equals emp.EmployeeId
                        select new EmployeeSickLeaveDto
                        {
                            EmployeeId = sickLeave.EmployeeId,
                            EmployeeName = emp.FullNameAR,
                            SickLeaveId = sickLeave.SickLeaveId,
                            RequestDate = sickLeave.RequestDate,
                            ExecutionDate = sickLeave.ExecutionDate,
                            FromDate = sickLeave.FromDate,
                            ToDate = sickLeave.ToDate,
                            NoDays = sickLeave.NoDays,
                            Notes = sickLeave.Notes,
                            WorkflowStatusId = sickLeave.WorkflowStatusId,
                            CreatedBy = sickLeave.CreatedBy,
                            CreatedDate = sickLeave.CreatedDate,
                            ModifiedBy = sickLeave.ModifiedBy,
                            ModifiedDate = sickLeave.ModifiedDate,
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

        public List<EmployeeSickLeaveDto> GetSickLeavesByEmployeeId(int EmployeeId, SearchFilterModel SearchModel)
        {
            var query = from sickLeave in Context.SickLeaves
                        join emp in Context.Employees on sickLeave.EmployeeId equals emp.EmployeeId
                        join branch in Context.Branches on emp.BranchId equals branch.BranchId
                        where sickLeave.EmployeeId == EmployeeId
                        select new EmployeeSickLeaveDto
                        {
                            EmployeeId = sickLeave.EmployeeId,
                            EmployeeName = emp.FullNameAR,
                            SickLeaveId = sickLeave.SickLeaveId,
                            RequestDate = sickLeave.RequestDate,
                            ExecutionDate = sickLeave.ExecutionDate,
                            BranchName = branch.NameAR,
                            FromDate = sickLeave.FromDate,
                            ToDate = sickLeave.ToDate,
                            NoDays = sickLeave.NoDays,
                            Notes = sickLeave.Notes,
                            WorkflowStatusId = sickLeave.WorkflowStatusId,
                            CreatedBy = sickLeave.CreatedBy,
                            CreatedDate = sickLeave.CreatedDate,
                            ModifiedBy = sickLeave.ModifiedBy,
                            ModifiedDate = sickLeave.ModifiedDate,
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

        public ActionsResponseModel AddNewEmployeeSickLeave(int EmployeeId, EmployeeSickLeaveDto model)
        {
            try
            {
                var sickLeave = new SickLeave
                {

                    EmployeeId = model.EmployeeId,
                    RequestDate = DateTime.Now,
                    ExecutionDate = model.ExecutionDate,
                    NoDays = model.NoDays,
                    Notes = model.Notes,
                    FromDate = model.FromDate,
                    ToDate = model.ToDate,
                    WorkflowStatusId = (int)HRWorkflowStatus.Approved,
                    CreatedBy = model.CreatedBy,
                    CreatedDate = DateTime.Now
                };

                Context.SickLeaves.Add(sickLeave);
                var result = Context.SaveChanges();

                return new ActionsResponseModel { Message = "SickLeave Added Successfly !" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public ActionsResponseModel EditEmployeeSickLeave(int EmployeeId, EmployeeSickLeaveDto model)
        {
            try
            {
                var sickLeave = Context.SickLeaves.FirstOrDefault(i => i.SickLeaveId == model.SickLeaveId);
                if (sickLeave != null)
                {
                    sickLeave.RequestDate = DateTime.Now;
                    sickLeave.ExecutionDate = model.ExecutionDate;
                    sickLeave.NoDays = model.NoDays;
                    sickLeave.Notes = model.Notes;
                    sickLeave.WorkflowStatusId = model.WorkflowStatusId;
                    sickLeave.ModifiedBy = model.ModifiedBy;
                    sickLeave.ModifiedDate = DateTime.Now;

                    Context.SaveChanges();

                    return new ActionsResponseModel { Message = "SickLeave Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "SickLeave not found" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public ActionsResponseModel DeleteEmployeeSickLeave(int SickLeaveId)
        {
            try
            {
                var sickLeave = Context.SickLeaves.FirstOrDefault(i => i.SickLeaveId == SickLeaveId);
                if (sickLeave != null)
                {
                    Context.Remove(sickLeave);
                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "SickLeave deleted successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "SickLeave not found" }; ;
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }
    }
}
