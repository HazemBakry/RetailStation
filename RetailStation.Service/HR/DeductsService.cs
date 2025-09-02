using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Enums;
using RetailStation.Entities.DTOs.HR;
using RetailStation.Entities.Models;
using RetailStation.Entities.Models.HR;
using RetailStation.Interface.HR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Service.HR
{
    public class DeductsService : IDeductsService
    {
        private readonly DBContext Context;

        public DeductsService(DBContext context)
        {
            Context = context;
        }

        public List<EmployeeDeductDto> GetAllEmployeeDeducts(SearchFilterModel SearchModel)
        {
            var query = from deduct in Context.Deducts
                        join emp in Context.Employees on deduct.EmployeeId equals emp.EmployeeId
                        join deductType in Context.DeductTypes on deduct.DeductTypeId equals deductType.DeductTypeId
                        select new EmployeeDeductDto
                        {
                            EmployeeId = deduct.EmployeeId,
                            EmployeeName = emp.FullNameAR,
                            DeductId = deduct.DeductId,
                            DeductTypeId = deduct.DeductTypeId,
                            DeductTypeName = deductType.NameAR,
                            ExecutionDate = deduct.ExecutionDate,
                            MoneyAmount = deduct.MoneyAmount,
                            Notes = deduct.Notes,
                            WorkflowStatusId = deduct.WorkflowStatusId,
                            CreatedBy = deduct.CreatedBy,
                            CreatedDate = deduct.CreatedDate,
                            ModifiedBy = deduct.ModifiedBy,
                            ModifiedDate = deduct.ModifiedDate,
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

        public List<EmployeeDeductDto> GetDeductsByEmployeeId(int EmployeeId, SearchFilterModel SearchModel)
        {

            var query = from deduct in Context.Deducts
                        join emp in Context.Employees on deduct.EmployeeId equals emp.EmployeeId
                        join branch in Context.Branches on emp.BranchId equals branch.BranchId
                        join deductType in Context.DeductTypes on deduct.DeductTypeId equals deductType.DeductTypeId
                        where deduct.EmployeeId == EmployeeId
                        select new EmployeeDeductDto
                        {
                            EmployeeId = deduct.EmployeeId,
                            EmployeeName = emp.FullNameAR,
                            DeductId = deduct.DeductId,
                            DeductTypeId = deduct.DeductTypeId,
                            DeductTypeName = deductType.NameAR,
                            BranchName = branch.NameAR,
                            ExecutionDate = deduct.ExecutionDate,
                            MoneyAmount = deduct.MoneyAmount,
                            Notes = deduct.Notes,
                            WorkflowStatusId = deduct.WorkflowStatusId,
                            CreatedBy = deduct.CreatedBy,
                            CreatedDate = deduct.CreatedDate,
                            ModifiedBy = deduct.ModifiedBy,
                            ModifiedDate = deduct.ModifiedDate,
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

        public ActionsResponseModel AddNewEmployeeDeduct(int EmployeeId, EmployeeDeductDto model)
        {

            try
            {
                var deduct = new Deduct();

                deduct.EmployeeId = model.EmployeeId;
                deduct.DeductTypeId = model.DeductTypeId;
                deduct.ExecutionDate = model.ExecutionDate;
                deduct.MoneyAmount = model.MoneyAmount;
                deduct.Notes = model.Notes;
                deduct.WorkflowStatusId = (int)WorkflowStatus.Approved;
                deduct.CreatedBy = model.CreatedBy;
                deduct.CreatedDate = DateTime.Now;

                Context.Deducts.Add(deduct);
                var result = Context.SaveChanges();


                return new ActionsResponseModel { Message = "Deduct Added Successfly !" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }

        public ActionsResponseModel EditEmployeeDeduct(int EmployeeId, EmployeeDeductDto model)
        {

            try
            {
                var deduct = Context.Deducts.FirstOrDefault(i => i.DeductId == model.DeductId);
                if (deduct != null)
                {
                    deduct.DeductTypeId = model.DeductTypeId;
                    deduct.ExecutionDate = model.ExecutionDate;
                    deduct.MoneyAmount = model.MoneyAmount;
                    deduct.Notes = model.Notes;
                    deduct.WorkflowStatusId = model.WorkflowStatusId;
                    deduct.ModifiedBy = model.ModifiedBy;
                    deduct.ModifiedDate = DateTime.Now;

                    Context.SaveChanges();


                    return new ActionsResponseModel { Message = "Deduct Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Deduct not found" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }


        public ActionsResponseModel DeleteEmployeeDeduct(int DeductId)
        {

            try
            {
                var deduct = Context.Deducts.FirstOrDefault(i => i.DeductId == DeductId);
                if (deduct != null)
                {
                    Context.Remove(deduct);
                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Deduct deleted successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Deduct not found" }; ;
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }

        public ActionsResponseModel ApproveEmployeeDeducts(bool isApproved, List<int> deductIds)
        {
            try
            {
                if (deductIds == null || !deductIds.Any())
                {
                    return new ActionsResponseModel { IsSuccess = false, Message = "No deduct IDs provided." };
                }

                var deducts = Context.Deducts.Where(i => deductIds.Contains(i.DeductId)).ToList();

                if (!deducts.Any())
                {
                    return new ActionsResponseModel { IsSuccess = false, Message = "No matching deducts found." };
                }

                int newStatus = isApproved ? (int)WorkflowStatus.Approved : (int)WorkflowStatus.Rejected;

                foreach (var deduct in deducts)
                {
                    deduct.WorkflowStatusId = newStatus;
                }

                Context.SaveChanges();

                return new ActionsResponseModel
                {
                    IsSuccess = true,
                    Message = isApproved ? "Deducts approved successfully!" : "Deducts rejected successfully!"
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

        public List<SelectorDataModel> GetDeductTypesSelector()
        {
            var results = Context.DeductTypes.Select(b => new SelectorDataModel
            {
                Id = b.DeductTypeId,
                Name = b.NameAR,
            }).ToList();
            return results;
        }
    }
}
