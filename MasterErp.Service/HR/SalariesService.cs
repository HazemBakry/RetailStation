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
using MasterErp.Entities.DTOs.Purchases;


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
        public List<SelectorDataModel> GetEmployeesForDuesSelector(DueType DueType)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@DueType", DueType);
            var result = SQLHelper.SQLQuery<SelectorDataModel>("[HR].[SP_GetEmployeesForDues]", null, param);
            return result;
        }
        public List<EmployeeDueModel> GetDues_Data(SearchFilterModel SearchModel, int? EmployeeId = null, int? EmployeeDuesId = null)
        {
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@EmployeeId", EmployeeId);
            param[1] = new SqlParameter("@EmployeeDuesId", EmployeeDuesId);
            param[2] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            param[3] = new SqlParameter("@PageSize", SearchModel.PageSize);
            param[4] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[4].Value = sharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);


            var result = SQLHelper.SQLQuery<EmployeeDueModel>("[HR].[SP_GetEmployeeDues]", null, param);

            return result;
        }
        public EmployeeDueModel GetEmployeeDuesById(int EmployeeDuesId)
        {
            return GetDues_Data(new SearchFilterModel { PageSize = 25, CurrentPage = 1 },null, EmployeeDuesId)?.FirstOrDefault();

        }
        public List<EmployeeDueModel> GetEmployeeDues(int EmployeeId, SearchFilterModel SearchModel)
        {
            //SqlParameter[] param = new SqlParameter[4];
            //param[0] = new SqlParameter("@EmployeeId", EmployeeId);
            //param[1] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            //param[2] = new SqlParameter("@PageSize", SearchModel.PageSize);
            //param[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            //param[3].Value = sharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);


            var result = GetDues_Data(SearchModel, EmployeeId);

            return result;
        }
        public ActionsResponseModel DeleteEmployeeDues(int EmployeeDuesId)
        {
            try
            {
                var dues = Context.EmployeeDues.FirstOrDefault(i => i.EmployeeDueId == EmployeeDuesId);
                if (dues != null && dues.WorkflowStatusId !=(int)WorkflowStatus.Completed)
                {
                    Context.Remove(dues);
                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Dues deleted successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Dues not found or closed" }; ;
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }
        public EmployeeDueModel CalculateEmployeeDue(int EmployeeId, EmployeeDueModel Model)
        {

            var contract = _employeeService.GetEmployeeContractInfoById(EmployeeId);
            if (contract == null)
                return null;

            var endDate = Model.LastJoinDate ?? DateTime.Now;
            var startDate = Model.JoinDate ?? DateTime.Now;
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


            var advances = _employeeAdvancesService.GetAdvancePaymentsData(new SearchFilterModel { CurrentPage = 1, PageSize = 100  },EmployeeId).Where(x=>x.WorkflowStatusId  != (int)WorkflowStatus.Completed).ToList();
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
        public DuesPreparationModel GetEmployeeDuesPreparationDate(int employeeId, DueType DueType, DuesPreparationModel model)
        {
            if (model == null)
                model = new DuesPreparationModel();

            var emp = Context.Employees
                .FirstOrDefault(x => x.EmployeeId == employeeId);

            if (emp == null||emp.LastJoinDate == null)
                return model;
            model.LastJoinDate = DueType ==DueType.EndOfContract ? emp.JoinDate:emp.LastJoinDate;
            model.BranchId = emp.BranchId;

            // 1. Get the last working date from EmployeeDues table
            if (model.LastJoinDate == null)
            {
                model.LastJoinDate = Context.EmployeeDues
                .Where(x => x.EmployeeId == employeeId)
                .Max(x => (DateTime?)x.LastJoinDate);
            }
                

            // 2. Get the most recent contract by start date
            var recentContract = Context.Contracts
                .Where(x => x.EmployeeId == employeeId)
                .OrderByDescending(x => x.StartDate)
                .FirstOrDefault();
            double? HousingAllowance = 0;
            if (recentContract !=null)
            {
                var recentContractSalaries = Context.ContractDetails
                                .Where(x => x.ContractId == recentContract.ContractId)
                                .OrderByDescending(x => x.ContractDetailId)
                                .FirstOrDefault();
                model.BasicSalary = recentContractSalaries?.BasicSalary;
                HousingAllowance = recentContractSalaries?.HousingAllowance;
            }

            // If no dues found, fallback to LastJoinDate from contract
            //if (model.LastJoinDate == null)
            //    model.LastJoinDate = recentContract?.LastJoinDate;

            model.ContractVacationPeriod = recentContract?.VacationPeriodDays;

            // 3. Get the first start date of all contracts
            //model.JoinDate = Context.Contracts
            //    .Where(x => x.EmployeeId == employeeId)
            //    .OrderBy(x => x.StartDate)
            //    .Select(x => (DateTime?)x.StartDate)
            //    .FirstOrDefault();
            model.JoinDate = emp.JoinDate;

            // 4. Get the latest annual vacation
            var lastVacation = Context.Vacations
                .Where(x => x.EmployeeId == employeeId && x.VacationTypeId == (int)VacationType.AnnualVacation)
                .OrderByDescending(x => x.FromDate)
                .FirstOrDefault();
            if (DueType == DueType.Vacation)
            {
                model.VacationStartDate = lastVacation?.FromDate;
                model.VacationEndDate = lastVacation?.ToDate;
                model.VacationId = lastVacation?.VacationId;
                model.CurrentVacationPeriod = lastVacation?.Period;
                if (model.ExecutionDate == null)
                    model.ExecutionDate = lastVacation?.FromDate;
                

            }
            else if (DueType == DueType.EndOfContract)
            {
                if (model.ExecutionDate == null)
                    model.ExecutionDate = DateTime.Now;
            }

            if (model.VacationStartDate != null && model.VacationEndDate != null && model.VacationStartDate < model.VacationEndDate)
            {
                var start = model.VacationStartDate.Value;
                var end = model.VacationEndDate.Value;

                int months = ((end.Year - start.Year) * 12) + end.Month - start.Month;
                if (end.Day > start.Day)
                {
                    months += 1;
                }
                model.HomeAllowance = months * (HousingAllowance ?? 0);
            }
            
            
            // 5. Get the latest paid salary
            var latestPaidSalary = Context.MonthlySalaryDetails
                .Where(d => d.EmployeeId == employeeId)
                .Join(
                    Context.MonthlySalary,
                    detail => detail.MonthlySalaryId,
                    header => header.MonthlySalaryId,
                    (detail, header) => new
                    {
                        Detail = detail,
                        SalaryMonth = header.SalaryMonth,
                        SalaryYear = header.SalaryYear
                    }
                )
                .OrderByDescending(x => x.SalaryYear)
                .ThenByDescending(x => x.SalaryMonth)
                .FirstOrDefault();
            model.LastPaidSalaryMonth = latestPaidSalary?.SalaryMonth ?? model.LastJoinDate?.Month;
            model.LastPaidSalaryYear = latestPaidSalary?.SalaryYear ?? model.LastJoinDate?.Year ;


            var advances = _employeeAdvancesService.GetAdvancePaymentsData(new SearchFilterModel { CurrentPage = 1, PageSize = 100 }, employeeId).Where(x => x.WorkflowStatusId != (int)WorkflowStatus.Completed).ToList();
            if (advances.Any())
            {
                model.Advances = advances.Sum(x => x.MoneyAmount);
            }
            var executionDate = model.ExecutionDate;
            DateTime? fromDate = DueType == DueType.Vacation ? model.LastJoinDate : model.JoinDate;
            if (fromDate!=null && executionDate != null)
                model.VacationDues = GetDuesByType(DueType, model.BasicSalary, fromDate.Value, executionDate.Value);
            model.SalaryDues = GetEmployeeSalaryDues(employeeId, model.SalaryDuesMonths);
            model.CalcTotalDues();
            return model;
        }
        private double GetEmployeeSalaryDues(int employeeId,List<SalaryDuesMonthModel> SalaryDuesMonthModel)
        {
            double salary = 0;
            if(SalaryDuesMonthModel != null)
            {
                List<FilterItem> FilterList = new List<FilterItem>();
                SearchFilterModel SearchModel = new SearchFilterModel();
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 100;
                FilterList.Add(new FilterItem
                {
                    CategoryName = "EmployeeId",
                    ItemFlag = employeeId.ToString(),
                });
                SearchModel.FilterList = FilterList;
                foreach (var item in SalaryDuesMonthModel)
                {

                    var result = GetEmployeeSalarySummary(item.SalaryYear, item.SalaryMonth, SearchModel);
                    if (result.Any())
                    {
                        var monthSalary = result.FirstOrDefault();
                        salary += ((double)monthSalary.TotalSalary.GetValueOrDefault() - (double)monthSalary.Advances);
                    }
                }
            }
            
            return salary;
        }
        private double GetDuesByType(DueType dueType, double? salary, DateTime fromDate, DateTime toDate)
        {
            if (salary == null || fromDate >= toDate)
                return 0;

            double dailySalary = (salary.Value / 30.0);

            // Calculate duration between fromDate and toDate in years, months, days
            int totalYears = toDate.Year - fromDate.Year;
            int totalMonths = toDate.Month - fromDate.Month;
            int totalDays = toDate.Day - fromDate.Day;

            if (totalDays < 0)
            {
                totalMonths -= 1;
                totalDays += DateTime.DaysInMonth(toDate.Year, toDate.Month == 1 ? 12 : toDate.Month - 1);
            }

            if (totalMonths < 0)
            {
                totalYears -= 1;
                totalMonths += 12;
            }

            // If more than a month and a few days => consider rounding to the next month
            if (totalMonths >= 0 && totalDays >= 1)
                totalMonths++;

            double totalYearsDecimal = totalYears + (totalMonths / 12.0);

            double vacationDuesDays = 0;

            if (dueType == DueType.Vacation)
            {
                vacationDuesDays = totalYearsDecimal * 21;
            }
            else if (dueType == DueType.EndOfContract)
            {
                // First 5 years: 15 days per year (0.5 month)
                // After 5 years: 30 days per year (1 month)
                if (totalYearsDecimal <= 5)
                {
                    vacationDuesDays = totalYearsDecimal * 15;
                }
                else
                {
                    vacationDuesDays = (5 * 15) + ((totalYearsDecimal - 5) * 30);
                }
            }

            double dues = Math.Round(vacationDuesDays * dailySalary, 2);
            return dues;
        }


        public ActionsResponseModel SaveEmployeeDue(int employeeId, DuesPreparationModel model)
        {
            // Check for overlapping due record
            EmployeeDue conflictingDue =  null;
            if ((int)model.DueTypeId == (int)DueType.Vacation)
            {
                if (model.VacationId == null)
                {
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = $"no vacation registered"
                    };
                }
                conflictingDue = Context.EmployeeDues
                                .Where(x => x.EmployeeId == employeeId && x.VacationId == model.VacationId)
                                .FirstOrDefault();
            }
                
            else if ((int)model.DueTypeId == (int)DueType.Vacation)
                conflictingDue = Context.EmployeeDues
                .Where(x => x.EmployeeId == employeeId)
                .FirstOrDefault();
            if (conflictingDue != null)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = $"Cannot save due. There is already a record with a LastWorkingDate later than the provided StartWorkingDate: {conflictingDue.JoinDate ?? conflictingDue.LastJoinDate:yyyy-MM-dd}"
                };
            }


            var entity = new EmployeeDue
            {
                EmployeeId = employeeId,
                DueTypeId = model.DueTypeId,
                NoMonths = (int)model.TotalDuesMonths,
                NoDays = (int)model.TotalDuesDays,
                JoinDate = model.JoinDate,
                LastJoinDate = model.LastJoinDate,
                ExecutionDate = model.ExecutionDate,

                Notes = "",
                VacationDues = (float?)model.VacationDues,
                EndOfServiceDues = (float?)model.EndOfServiceDues,
                SalaryDues = (float?)model.SalaryDues,
                FlightTicketDues = (float?)model.FlightTicketDues,
                HomeAllowance = (float?)model.HomeAllowance,
                Advances = (float?)model.Advances,
                NetAmount = (float?)model.TotalDueAmount,
                TotalDuesAmount = (float?)model.TotalDueAmount,
                WorkflowStatusId = (int)WorkflowStatus.Pending,
                VacationId = model.VacationId,
                CreatedBy = "",
                CreatedDate = DateTime.Now
            };
            if(model.IncludeSalary == true)
            {
                //entity.SalaryMonth = model.SalaryMonth;
                //entity.SalaryYear = model.SalaryYear;
                //entity.AddSalaryToDue = model.AddSalaryToDue;



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
