using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Common.Export;
using MasterErp.Entities.Common.Lookups;
using MasterErp.Entities.Common.SQLTabeType;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.DTOs.Purchases;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.HR;
using MasterErp.Entities.Models.Purchases;
using MasterErp.Interface.Common;
using MasterErp.Interface.HR;
using MasterErp.Interface.Shared;
using MasterErp.Service.Common;
using MasterErp.Service.Shared;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.HR
{
    public class FinancialCustodyService : IFinancialCustodyService
    {
        private readonly DBContext Context;
        private readonly IConfiguration Configuration;
        private readonly ISQLHelper SQLHelper;
        private readonly ISharedService SharedService;
        private readonly LookupsDbContext LookupsDbContext;
        private readonly ISharedFilterService sharedFilterService;
        private readonly IExportService _exportService;


        public FinancialCustodyService(DBContext Context, ISQLHelper SQLHelper, ISharedService SharedService, IConfiguration Configuration, LookupsDbContext lookupsDbContext, ISharedFilterService sharedFilterService, IExportService exportService)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.SharedService = SharedService;
            this.Configuration = Configuration;
            LookupsDbContext = lookupsDbContext;
            this.sharedFilterService = sharedFilterService;
            _exportService = exportService;
            //ConnectionString = Configuration.GetConnectionString("DBConnection");
        }


        public List<EmployeeFinancialCustodyModel> GetAllEmployeeFinancialCustodyData(SearchFilterModel SearchModel, int? EmployeeId = null, int? EmployeeFinancialCustodyId = null)
        {

            var FilterListTable = sharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);
            SqlParameter[] param = new SqlParameter[5];

            param[0] = new SqlParameter("@EmployeeId", EmployeeId);
            param[1] = new SqlParameter("@EmployeeFinancialCustodyId", EmployeeFinancialCustodyId);
            param[2] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            param[3] = new SqlParameter("@PageSize", SearchModel.PageSize);
            param[4] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[4].Value = FilterListTable;

            var result = SQLHelper.SQLQuery<EmployeeFinancialCustodyModel>("[HR].[SP_GetEmployeeFinancialCustodyData]", null, param);
            return result;
        }
        public ActionsResponseModel GetAllEmployeeFinancialCustody_Export(SearchFilterModel SearchModel)
        {
            string url = string.Empty;
            try
            {
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 990000;
                var Data = GetAllEmployeeFinancialCustodyData(SearchModel);

                var result = Data.Select(x => new EmployeeFinancialCustodyExportModel
                {
                    EmployeeCode = x.EmployeeCode,
                    EmployeeName = x.EmployeeNameAR ?? x.EmployeeNameEN,
                    BranchName = x.BranchNameAR ?? x.BranchNameEN,
                    JobName = x.JobNameAR ?? x.JobNameEN,
                    FinancialCustodyType = x.FinancialCustodyTypeNameAR ?? x.FinancialCustodyTypeNameEN,
                    ExecutionDate = x.ExecutionDate.ToString("MM/dd/yyyy"),
                    MoneyAmount = x.MoneyAmount.ToString(),
                    WorkflowStatus = x.WorkflowStatusNameAR ?? x.WorkflowStatusNameEN,
                    Notes = x.Notes,
                }).ToList();

                if (!result.Any())
                {
                    result.Add(new EmployeeFinancialCustodyExportModel());

                }


                var dtExport = DalHelper.ConvertToDataTable(result, "Employee Financial Custody");


                url = GetExportUrl(dtExport, "Employee Financial Custody");


                return new ActionsResponseModel
                {
                    IsSuccess = true,
                    URL = url,
                    Message = "File Exported successfully"
                };

            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Status = 0,
                    URL = "",
                    Message = ex.InnerException?.Message ?? ex.Message,
                };
            }

        }


        public List<EmployeeFinancialCustodyModel> GetFinancialCustodyByEmployeeId(int employeeId, SearchFilterModel SearchModel)
        {

            var results = GetAllEmployeeFinancialCustodyData(SearchModel, employeeId);
            return results;
        }
        public EmployeeFinancialCustodyModel GetFinancialCustodyById(int EmployeeFinancialCustodyId)
        {
            return GetAllEmployeeFinancialCustodyData(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, null, EmployeeFinancialCustodyId)?.FirstOrDefault();

        }

        public ActionsResponseModel AddNewEmployeeFinancialCustody(int EmployeeId, EmployeeFinancialCustodyModel model)
        {
            try
            {
                var financialCustody = new EmployeeFinancialCustody
                {
                    EmployeeId = EmployeeId,
                    FinancialCustodyTypeId = model.FinancialCustodyTypeId,
                    ExecutionDate = model.ExecutionDate,
                    MoneyAmount = model.MoneyAmount,
                    Notes = model.Notes,
                    WorkflowStatusId = (int)WorkflowStatus.Pending,
                    CreatedDate = DateTime.Now,
                    CreatedBy = model.CreatedBy
                };
                Context.EmployeeFinancialCustody.Add(financialCustody);
                var result = Context.SaveChanges();

                return new ActionsResponseModel { Message = "FinancialCustody Applied Successfly !" };
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

        public ActionsResponseModel EditFinancialCustody(int EmployeeId, EmployeeFinancialCustodyModel model)
        {
            try
            {
                var financialCustody = Context.EmployeeFinancialCustody.FirstOrDefault(i => i.EmployeeFinancialCustodyId == model.EmployeeFinancialCustodyId);
                if (financialCustody != null)
                {
                    financialCustody.MoneyAmount = model.MoneyAmount;
                    financialCustody.ExecutionDate = model.ExecutionDate;
                    financialCustody.Notes = model.Notes;
                    financialCustody.ModifiedDate = DateTime.Now;
                    financialCustody.ModifiedBy = model.ModifiedBy;

                    Context.SaveChanges();


                    return new ActionsResponseModel { Message = "Financial Custody Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Financial Custody not found" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }

        public ActionsResponseModel DeleteFinancialCustody(int EmployeeFinancialCustodyId)
        {
            try
            {
                var EmployeeFinancialCustody = Context.EmployeeFinancialCustody.FirstOrDefault(i => i.EmployeeFinancialCustodyId == EmployeeFinancialCustodyId);
                if (EmployeeFinancialCustody != null)
                {
                    Context.Remove(EmployeeFinancialCustody);
                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Financial Custody deleted successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Financial Custody not found" }; ;
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }


        public ActionsResponseModel ApproveEmployeeFinancialCustody(int EmployeeFinancialCustodyId, int EmployeeId, bool ApproveStatus)
        {

            try
            {
                var financialCustody = Context.EmployeeFinancialCustody.FirstOrDefault(i => i.EmployeeFinancialCustodyId == EmployeeFinancialCustodyId && i.EmployeeId == EmployeeId);

                if (financialCustody != null)
                {
                    financialCustody.WorkflowStatusId = ApproveStatus ? (int)WorkflowStatus.Approved : (int)WorkflowStatus.Rejected; ;
                    financialCustody.ModifiedBy = string.Empty;
                    financialCustody.ModifiedDate = DateTime.Now;

                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Financial Custody Status changed successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Financial Custody not found" }; ;
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }

        public ActionsResponseModel ApproveEmployeeFinancialCustody(bool isApproved, List<int> financialCustodyIds)
        {
            try
            {
                if (financialCustodyIds == null || !financialCustodyIds.Any())
                {
                    return new ActionsResponseModel { IsSuccess = false, Message = "No financialCustody IDs provided." };
                }

                var deducts = Context.EmployeeFinancialCustody.Where(i => financialCustodyIds.Contains(i.EmployeeFinancialCustodyId)).ToList();

                if (!deducts.Any())
                {
                    return new ActionsResponseModel { IsSuccess = false, Message = "No financialCustody deducts found." };
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
                    Message = isApproved ? "FinancialCustody approved successfully!" : "FinancialCustody rejected successfully!"
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

        private string GetExportUrl(DataTable DT, string Name)
        {
            DT.TableName = Name;

            ExportTemplateBase exportTemplateBase = new ExportTemplateBase
            {
                Name = Name,
                Username = "",
                TemplateName = Name,
                ReportName = Name,
                CustomerName = "",
                ExcelStyle = ExcelExportStyle.reportStyle,
                SheetName = "Data",
            };
            return _exportService.Export(exportTemplateBase, DT);
        }



    }
}
