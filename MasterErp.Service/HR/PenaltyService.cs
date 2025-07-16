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
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.HR
{
    public class PenaltyService : IPenaltyService
    {
        private readonly DBContext Context;

        public PenaltyService(DBContext context)
        {
            Context = context;
        }



        public List<EmployeePenaltyDto> GetAllEmployeePenaltiesData(SearchFilterModel SearchModel)
        {
            var query = from penalty in Context.Penalties
                        join emp in Context.Employees on penalty.EmployeeId equals emp.EmployeeId
                        join penaltyType in Context.PenaltyTypes on penalty.PenaltyTypeId equals penaltyType.PenaltyTypeId
                        select new EmployeePenaltyDto
                        {
                            EmployeeId = penalty.EmployeeId,
                            EmployeeName = emp.FullNameAR,
                            PenaltyId = penalty.PenaltyId,
                            PenaltyTypeId = penalty.PenaltyTypeId,
                            ExecutionDate = penalty.ExecutionDate,
                            PenaltyDate = penalty.PenaltyDate,
                            TotalDeduction = penalty.TotalDeduction,
                            DeductionByDays = penalty.DeductionByDays,
                            DeductionAmount = penalty.DeductionAmount,
                            Reason = penalty.Reason,
                            WorkflowStatusId = penalty.WorkflowStatusId,
                            CreatedBy = penalty.CreatedBy,
                            CreatedDate = penalty.CreatedDate,
                            ModifiedBy = penalty.ModifiedBy,
                            ModifiedDate = penalty.ModifiedDate,
                            PenaltyType = penaltyType.NameEN,
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

        public List<EmployeePenaltyDto> GetPenaltiesByEmployeeId(int EmployeeId, SearchFilterModel SearchModel)
        {
            var query = from penalty in Context.Penalties
                        join emp in Context.Employees on penalty.EmployeeId equals emp.EmployeeId
                        join branch in Context.Branches on emp.BranchId equals branch.BranchId
                        join penaltyType in Context.PenaltyTypes on penalty.PenaltyTypeId equals penaltyType.PenaltyTypeId
                        where penalty.EmployeeId == EmployeeId
                        select new EmployeePenaltyDto
                        {
                            EmployeeId = penalty.EmployeeId,
                            EmployeeName = emp.FatherNameAR,
                            PenaltyId = penalty.PenaltyId,
                            PenaltyTypeId = penalty.PenaltyTypeId,
                            ExecutionDate = penalty.ExecutionDate,
                            BranchName = branch.NameAR,
                            PenaltyDate = penalty.PenaltyDate,
                            TotalDeduction = penalty.TotalDeduction,
                            DeductionByDays = penalty.DeductionByDays,
                            DeductionAmount = penalty.DeductionAmount,
                            Reason = penalty.Reason,
                            WorkflowStatusId = penalty.WorkflowStatusId,
                            CreatedBy = penalty.CreatedBy,
                            CreatedDate = penalty.CreatedDate,
                            ModifiedBy = penalty.ModifiedBy,
                            ModifiedDate = penalty.ModifiedDate,
                            PenaltyType = penaltyType.NameEN,
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

        public ActionsResponseModel AddNewEmployeePenalty(int EmployeeId, EmployeePenaltyDto model)
        {

            try
            {
                var penalty = new Penalty();

                penalty.EmployeeId = EmployeeId;

                penalty.PenaltyTypeId = model.PenaltyTypeId;
                penalty.ExecutionDate = model.ExecutionDate;
                penalty.PenaltyDate = DateTime.Now;
                penalty.TotalDeduction = model.TotalDeduction;
                penalty.DeductionByDays = model.DeductionByDays;
                penalty.DeductionAmount = model.DeductionAmount ?? 0;
                penalty.Reason = model.Reason;
                penalty.WorkflowStatusId = (int)WorkflowStatus.Approved;
                penalty.CreatedBy = model.CreatedBy;
                penalty.CreatedDate = DateTime.Now;

                Context.Penalties.Add(penalty);
                var result = Context.SaveChanges();


                return new ActionsResponseModel { Message = "Penalty Added Successfly !" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }

        public ActionsResponseModel EditEmployeePenalty(int EmployeeId, EmployeePenaltyDto model)
        {

            try
            {
                var penalty = Context.Penalties.FirstOrDefault(i => i.PenaltyId == model.PenaltyId);
                if (penalty != null)
                {
                    penalty.PenaltyTypeId = model.PenaltyTypeId;
                    penalty.ExecutionDate = model.ExecutionDate;
                    // penalty.PenaltyDate = model.PenaltyDate;
                    penalty.TotalDeduction = model.TotalDeduction;
                    penalty.DeductionByDays = model.DeductionByDays;
                    penalty.DeductionAmount = model.DeductionAmount;
                    penalty.Reason = model.Reason;
                    penalty.WorkflowStatusId = model.WorkflowStatusId;

                    penalty.ModifiedBy = model.ModifiedBy;
                    penalty.ModifiedDate = DateTime.Now;

                    Context.SaveChanges();


                    return new ActionsResponseModel { Message = "Penalty Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Penalty not found" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }


        public ActionsResponseModel DeleteEmployeePenalty(int PenaltyId)
        {

            try
            {
                var penalty = Context.Penalties.FirstOrDefault(i => i.PenaltyId == PenaltyId);
                if (penalty != null)
                {
                    Context.Remove(penalty);
                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Penalty deleted successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Penalty not found" }; ;
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }

        public List<SelectorDataModel> GetPenaltyTypesSelector()
        {
            var result = Context.PenaltyTypes.Select(type => new SelectorDataModel
            {
                Id = type.PenaltyTypeId,
                Name = type.NameEN
            }).ToList();

            return result;
        }

        public ActionsResponseModel ApproveEmployeePenalties(bool isApproved, List<int> penaltieIds)
        {
            try
            {
                if (penaltieIds == null || !penaltieIds.Any())
                {
                    return new ActionsResponseModel { IsSuccess = false, Message = "No penaltie IDs provided." };
                }

                var penalties = Context.Penalties.Where(i => penaltieIds.Contains(i.PenaltyId)).ToList();

                if (!penalties.Any())
                {
                    return new ActionsResponseModel { IsSuccess = false, Message = "No matching penalties found." };
                }

                int newStatus = isApproved ? (int)WorkflowStatus.Approved : (int)WorkflowStatus.Rejected;

                foreach (var penaltie in penalties)
                {
                    penaltie.WorkflowStatusId = newStatus;
                }

                Context.SaveChanges();

                return new ActionsResponseModel
                {
                    IsSuccess = true,
                    Message = isApproved ? "Penalties approved successfully!" : "Penalties rejected successfully!"
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
