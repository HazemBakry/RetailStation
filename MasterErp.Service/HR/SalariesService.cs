using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.HR;
using MasterErp.Interface.Common;
using MasterErp.Interface.HR;
using MasterErp.Service.Common;
using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Linq;
using MasterErp.Entities.Common.Enums;
using Microsoft.AspNetCore.Http.HttpResults;
using MasterErp.Entities.Common.Export;


namespace MasterErp.Service.HR
{
    public class SalariesService : ISalariesService
    {
        private readonly DBContext Context;
        private readonly ISharedFilterService sharedFilterService;
        private readonly ISQLHelper SQLHelper;
        private readonly IEmployeeService _employeeService;
        private readonly IEmployeeAdvancesService _employeeAdvancesService;
        private readonly IExportService _exportService;

        public SalariesService(DBContext context, ISharedFilterService sharedFilterService, ISQLHelper sQLHelper, IEmployeeService employeeService, IEmployeeAdvancesService employeeAdvancesService, IExportService exportService)
        {
            Context = context;
            this.sharedFilterService = sharedFilterService;
            SQLHelper = sQLHelper;
            _employeeService = employeeService;
            _employeeAdvancesService = employeeAdvancesService;
            _exportService = exportService;
        }



        public List<EmployeeSalarySummaryModel> GetEmployeeSalarySummary(int Year, int Month, SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@Year", Year);
            param[1] = new SqlParameter("@Month", Month);
            param[2] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            param[3] = new SqlParameter("@PageSize", SearchModel.PageSize);
            param[4] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[4].Value = sharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);


            var result = SQLHelper.SQLQuery<EmployeeSalarySummaryModel>("[HR].[SP_GetEmployeeSalarySummary]", null, param);

            return result;
        }
        public ActionsResponseModel GetEmployeeSalarySummary_Export(int Year, int Month, SearchFilterModel SearchModel)
        {
            string url = string.Empty;
            try
            {
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 990000;
                var Data = GetEmployeeSalarySummary(Year, Month, SearchModel);

                var result = Data.Select(x => new EmployeeSalarySummaryExportModel
                {
                    EmployeeCode = x.EmployeeCode,
                    EmployeeName = x.EmployeeNameAR ?? x.EmployeeNameEN,
                    BranchName = x.BranchNameAR ?? x.BranchNameEN,
                    JobTitle = x.JobNameAR ?? x.JobNameEN,
                    BankAccountNumber = x.BankAccountNumber,
                    Bank = x.Bank,
                    BasicSalary = x.BasicSalary,
                    ExtraSalary = x.ExtraSalary,
                    Transportation = x.Transportation,
                    HousingAllowance = x.HousingAllowance,
                    MobileAllowance = x.MobileAllowance,
                    WorkNature = x.WorkNature,
                    MealAllowance = x.MealAllowance,
                    Other = x.Other,
                    GrossSalary = x.GrossSalary,
                    Deductions = x.Deductions,
                    Advances = x.Advances,
                    Penalties = x.Penalties,
                    Overtime = x.Overtime,
                    NetSalary = x.NetSalary,
                    PresentDays = x.PresentDays,
                    OffDays = x.OffDays,
                    SickDays = x.SickDays,
                    AbsentDays = x.AbsentDays,
                    TotalWorkingDays = x.TotalWorkingDays
                }).ToList();


                if (!result.Any())
                {
                    result.Add(new EmployeeSalarySummaryExportModel());

                }


                var dtExport = DalHelper.ConvertToDataTable(result, "Employee Salary");


                url = GetExportUrl(dtExport, "Employee Salary");


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


        #region Employee Dues
        public List<EmployeeDueModel> GetEmployeeDues(int EmployeeId, SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[4];
            param[0] = new SqlParameter("@EmployeeId", EmployeeId);
            param[1] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            param[2] = new SqlParameter("@PageSize", SearchModel.PageSize);
            param[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[3].Value = sharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);


            var result = SQLHelper.SQLQuery<EmployeeDueModel>("[HR].[SP_GetEmployeeDues]", null, param);

            return result;
        }

        public EmployeeDueModel CalculateEmployeeDue(int EmployeeId, EmployeeDueModel Model)
        {

            var contract = _employeeService.GetEmployeeContractInfoById(EmployeeId);
            if (contract == null)
                return null;

            var endDate = Model.LastWorkingDate ?? DateTime.Now;
            var startDate = Model.StartWorkingDate ?? DateTime.Now;
            // Total days
            int totalDays = (endDate - startDate).Days;
            int totalMonths = ((endDate.Year - startDate.Year) * 12) + endDate.Month - startDate.Month;
            if (endDate.Day < startDate.Day)
            {
                totalMonths--;
            }

            double totalYears = totalDays / 365.25;

            Model.NoMonths = totalMonths;
            Model.NoDays = totalDays;


            decimal dailySalary = (decimal)(contract.TotalSalary / 30.0);
            int workingDays = 30;
            decimal calculatedSalary = dailySalary * workingDays;


            var advances = _employeeAdvancesService.GetAdvancePaymentsData(new SearchFilterModel { CurrentPage = 1, PageSize = 100  },EmployeeId).Where(x=>x.WorkflowStatusId  != (int)PaymentWorkflowStatus.Paid).ToList();
            if(advances.Any())
            {
                Model.Advances = advances.Sum(x => x.MoneyAmount);
            }


            if(Model.DueTypeId == ((int)DueType.Vacation))
            {
                // 1 month for each year
                 Model.VacationDues = totalYears * (double)calculatedSalary;
            }
            if (Model.DueTypeId == ((int)DueType.EndOfContract))
            {
                // 2 moth for each year
                Model.EndOfServiceDues = totalYears * 2 * (double)calculatedSalary;
            }
            if(Model.AddSalaryToDue)
            {
                Model.CurrentMonthSalary = (double)calculatedSalary;
            }
            Model.HomeAllowance = contract.HousingAllowance;
            Model.TotalDues = Model.VacationDues.GetValueOrDefault() + Model.EndOfServiceDues.GetValueOrDefault() + Model.CurrentMonthSalary.GetValueOrDefault() + Model.HomeAllowance.GetValueOrDefault();
            Model.NetAmount = Model.TotalDues - Model.Advances.GetValueOrDefault();


            return Model;

        }
        public DateTime? GetEmployeeDueStartDate(int employeeId)
        {
            var date = Context.EmployeeDues
               .Where(x => x.EmployeeId == employeeId).Max(x=>x.LastWorkingDate);
            if (date == null)
                date = Context.Contracts.Where(x => x.EmployeeId == employeeId)?.OrderByDescending(x=>x.StartDate).FirstOrDefault()?.StartDate;

            return date ?? DateTime.Now;
        }
        public ActionsResponseModel SaveEmployeeDue(int employeeId, EmployeeDueModel model)
        {
            // Check for overlapping due record
            var conflictingDue = Context.EmployeeDues
                .Where(x => x.EmployeeId == employeeId && x.LastWorkingDate > model.StartWorkingDate)
                .FirstOrDefault();

            if (conflictingDue != null)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = $"Cannot save due. There is already a record with a LastWorkingDate later than the provided StartWorkingDate: {conflictingDue.LastWorkingDate:yyyy-MM-dd}"
                };
            }


            var entity = new EmployeeDue
            {
                EmployeeId = employeeId,
                DueTypeId = model.DueTypeId,
                NoMonths = 0,
                NoDays = 0,
                StartWorkingDate = model.StartWorkingDate,
                LastWorkingDate = model.LastWorkingDate,
                ExecutionDate = model.ExecutionDate,

                Notes = model.Notes,
                VacationDues = (float?)model.VacationDues,
                EndOfServiceDues = (float?)model.EndOfServiceDues,
                CurrentMonthSalary = (float?)model.CurrentMonthSalary,
                HomeAllowance = (float?)model.HomeAllowance,
                Advances = (float?)model.Advances,
                NetAmount = (float?)model.NetAmount,
                CreatedBy = model.CreatedBy,
                CreatedDate = DateTime.Now
            };
            if(model.AddSalaryToDue == true)
            {
                entity.SalaryMonth = model.SalaryMonth;
                entity.SalaryYear = model.SalaryYear;
                entity.AddSalaryToDue = model.AddSalaryToDue;

            }
            Context.EmployeeDues.Add(entity);
            var isSaved = Context.SaveChanges() > 0;

            return new ActionsResponseModel
            {
                IsSuccess = isSaved,
                Message = isSaved ? "Employee due saved successfully." : "Failed to save employee due."
            };
        }

        #endregion

        public ActionsResponseModel ApproveMonthlySalary(int year, int month, SearchFilterModel searchModel)
        {
            searchModel.CurrentPage = 1;
            searchModel.PageSize = 1000000;
            //int.TryParse(searchModel?.FilterList?.FirstOrDefault(x => x.CategoryName == "BranchId")?.ItemFlag, out int branchId);


            var employees = GetEmployeeSalarySummary(year, month, searchModel);
            if (!employees.Any())
            {
                return new ActionsResponseModel { IsSuccess = false, Message = "No employees found for this selection." };
            }

            var groupedByBranch = employees
                .Where(e => e.BranchId.HasValue)
                .GroupBy(e => e.BranchId.Value)
                .ToList();

            foreach (var branchGroup in groupedByBranch)
            {
                var branchId = branchGroup.Key;
                var model = new MonthlySalaryModel
                {
                    BranchId = branchId,
                    SalaryMonth = month,
                    SalaryYear = year,
                    CreatedBy = "",
                    EmployeeSalaries = branchGroup.Select(e => new MonthlySalaryDetailsModel
                    {
                        EmployeeId = e.EmployeeId ?? 0,
                        BasicSalary = (decimal?)e.BasicSalary,
                        ExtraSalary = (decimal?)e.ExtraSalary,
                        Transportation = (decimal?)e.Transportation,
                        HousingAllowance = (decimal?)e.HousingAllowance,
                        MobileAllowance = (decimal?)e.MobileAllowance,
                        WorkNature = (decimal?)e.WorkNature,
                        MealAllowance = (decimal?)e.MealAllowance,
                        Other = (decimal?)e.Other,
                        GrossSalary = (decimal?)e.GrossSalary,
                        Deductions = (decimal?)e.Deductions,
                        Advances = (decimal?)e.Advances,
                        Penalties = (decimal?)e.Penalties,
                        Overtime = (decimal?)e.Overtime,
                        NetSalary = (decimal?)e.NetSalary,
                        PresentDays = e.PresentDays,
                        OffDays = e.OffDays,
                        SickDays = e.SickDays,
                        AbsentDays = e.AbsentDays,
                        TotalWorkingDays = e.TotalWorkingDays,
                        BankAccountNumber = e.BankAccountNumber,
                        Bank = e.Bank
                    }).ToList()
                };

                SaveMonthlySalary(model);
            }

            return new ActionsResponseModel
            {
                IsSuccess = true,
                Message = "Monthly salaries approved for all branches successfully."
            };
        }

        public ActionsResponseModel SaveMonthlySalary(MonthlySalaryModel model)
        {
            var existing = Context.MonthlySalary.FirstOrDefault(x =>
                x.BranchId == model.BranchId &&
                x.SalaryMonth == model.SalaryMonth &&
                x.SalaryYear == model.SalaryYear);

            if (existing == null)
            {
                existing = new MonthlySalary
                {
                    BranchId = model.BranchId,
                    SalaryMonth = model.SalaryMonth,
                    SalaryYear = model.SalaryYear,
                    CreatedBy = model.CreatedBy,
                    CreatedDate = DateTime.Now
                };
                Context.MonthlySalary.Add(existing);
            }
            existing.TotalEmployees = (existing.TotalEmployees ?? 0) + model.EmployeeSalaries.Count;
            existing.TotalBasicSalary = (existing.TotalBasicSalary ?? 0) + model.EmployeeSalaries.Sum(e => e.BasicSalary ?? 0);
            existing.TotalTransportation = (existing.TotalTransportation ?? 0) + model.EmployeeSalaries.Sum(e => e.Transportation ?? 0);
            existing.TotalHousingAllowance = (existing.TotalHousingAllowance ?? 0) + model.EmployeeSalaries.Sum(e => e.HousingAllowance ?? 0);
            existing.TotalMobileAllowance = (existing.TotalMobileAllowance ?? 0) + model.EmployeeSalaries.Sum(e => e.MobileAllowance ?? 0);
            existing.TotalMealAllowance = (existing.TotalMealAllowance ?? 0) + model.EmployeeSalaries.Sum(e => e.MealAllowance ?? 0);
            existing.TotalExtraSalary = (existing.TotalExtraSalary ?? 0) + model.EmployeeSalaries.Sum(e => e.ExtraSalary ?? 0);
            existing.TotalOtherAllowance = (existing.TotalOtherAllowance ?? 0) + model.EmployeeSalaries.Sum(e => e.Other ?? 0);
            existing.TotalGrossSalary = (existing.TotalGrossSalary ?? 0) + model.EmployeeSalaries.Sum(e => e.GrossSalary ?? 0);
            existing.TotalDeductions = (existing.TotalDeductions ?? 0) + model.EmployeeSalaries.Sum(e => e.Deductions ?? 0);
            existing.TotalAdvances = (existing.TotalAdvances ?? 0) + model.EmployeeSalaries.Sum(e => e.Advances ?? 0);
            existing.TotalPenalties = (existing.TotalPenalties ?? 0) + model.EmployeeSalaries.Sum(e => e.Penalties ?? 0);
            existing.TotalOvertime = (existing.TotalOvertime ?? 0) + model.EmployeeSalaries.Sum(e => e.Overtime ?? 0);
            existing.TotalNetSalary = (existing.TotalNetSalary ?? 0) + model.EmployeeSalaries.Sum(e => e.NetSalary ?? 0);


            Context.SaveChanges();

            foreach (var emp in model.EmployeeSalaries)
            {
                var detail = new MonthlySalaryDetails
                {
                    MonthlySalaryId = existing.MonthlySalaryId,
                    EmployeeId = emp.EmployeeId,
                    BasicSalary = emp.BasicSalary,
                    ExtraSalary = emp.ExtraSalary,
                    Transportation = emp.Transportation,
                    HousingAllowance = emp.HousingAllowance,
                    MobileAllowance = emp.MobileAllowance,
                    WorkNature = emp.WorkNature,
                    MealAllowance = emp.MealAllowance,
                    Other = emp.Other,
                    GrossSalary = emp.GrossSalary,
                    Deductions = emp.Deductions,
                    Advances = emp.Advances,
                    Penalties = emp.Penalties,
                    Overtime = emp.Overtime,
                    NetSalary = emp.NetSalary,
                    PresentDays = emp.PresentDays,
                    OffDays = emp.OffDays,
                    SickDays = emp.SickDays,
                    AbsentDays = emp.AbsentDays,
                    TotalWorkingDays = emp.TotalWorkingDays,
                    Bank = emp.Bank,
                    BankAccountNumber = emp.BankAccountNumber,
                    CreatedBy = model.CreatedBy,
                    CreatedDate = DateTime.Now
                };
                Context.MonthlySalaryDetails.Add(detail);
            }

            Context.SaveChanges();

            return new ActionsResponseModel { IsSuccess = true, Message = "Monthly salary saved successfully" };
        }

        public MonthlySalaryDetails MapToMonthlySalaryDetail(EmployeeSalarySummaryModel model, int monthlySalaryId, string createdBy)
        {
            return new MonthlySalaryDetails
            {
                MonthlySalaryId = monthlySalaryId,
                EmployeeId = model.EmployeeId ?? 0,
                Bank = model.Bank,
                BankAccountNumber = model.BankAccountNumber,
                BasicSalary = (decimal?)model.BasicSalary,
                ExtraSalary = (decimal?)model.ExtraSalary,
                Transportation = (decimal?)model.Transportation,
                HousingAllowance = (decimal?)model.HousingAllowance,
                MobileAllowance = (decimal?)model.MobileAllowance,
                WorkNature = (decimal?)model.WorkNature,
                MealAllowance = (decimal?)model.MealAllowance,
                Other = (decimal?)model.Other,
                GrossSalary = (decimal?)model.GrossSalary,
                Deductions = (decimal?)model.Deductions,
                Advances = (decimal?)model.Advances,
                Penalties = (decimal?)model.Penalties,
                Overtime = (decimal?)model.Overtime,
                NetSalary = (decimal?)model.NetSalary,

                PresentDays = model.PresentDays,
                OffDays = model.OffDays,
                SickDays = model.SickDays,
                AbsentDays = model.AbsentDays,
                TotalWorkingDays = model.TotalWorkingDays,

                CreatedBy = createdBy,
                CreatedDate = DateTime.Now
            };
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
