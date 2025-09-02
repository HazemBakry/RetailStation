using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Enums;
using RetailStation.Entities.Common.Export;
using RetailStation.Entities.DTOs.GeneralAccounts;
using RetailStation.Entities.DTOs.HR;
using RetailStation.Interface.Common;
using RetailStation.Interface.HR;
using RetailStation.Service.Common;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Service.HR
{
    public class HRReportsService : IHRReportsService
    {
        private readonly IConfiguration _configuration;
        private readonly IExportService _exportService;
        private readonly ISQLHelper _sQLHelper;
        private readonly ISharedFilterService sharedFilterService;

        private string ConnectionString;

        public HRReportsService(ISQLHelper SQLHelper, IConfiguration Configuration, IExportService exportService, ISharedFilterService sharedFilterService)
        {
            _sQLHelper = SQLHelper;
            _configuration = Configuration;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
            _exportService = exportService;
            this.sharedFilterService = sharedFilterService;
        }

        #region Payroll Reports

        public DataTable GetPayrollReportVacations(SearchFilterModel SearchModel)
        {
            var SearchText = SearchModel.FilterModel.FilterItems.Where(x => x.CategoryName == "SearchText").Select(x => x.ItemFlag).FirstOrDefault();

            SqlParameter[] Params = new SqlParameter[5];
            Params[0] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            Params[1] = new SqlParameter("@PageSize", SearchModel.PageSize);
            Params[2] = new SqlParameter("@SearchText", SearchText ?? (object)DBNull.Value);
            Params[3] = new SqlParameter("@FromDate", SearchModel.FromDate ?? (object)DBNull.Value);
            Params[4] = new SqlParameter("@ToDate", SearchModel.ToDate ?? (object)DBNull.Value);

            var result = _sQLHelper.ExecuteDataTable("[HR].[SP_GetPayrollReportVacations]", Params, null);
            return result;
        }

        public DataTable GetPayrollReportOverTime(SearchFilterModel SearchModel)
        {
            var SearchText = SearchModel.FilterModel.FilterItems.Where(x => x.CategoryName == "SearchText").Select(x => x.ItemFlag).FirstOrDefault();

            SqlParameter[] Params = new SqlParameter[5];
            Params[0] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            Params[1] = new SqlParameter("@PageSize", SearchModel.PageSize);
            Params[2] = new SqlParameter("@SearchText", SearchText ?? (object)DBNull.Value);
            Params[3] = new SqlParameter("@FromDate", SearchModel.FromDate ?? (object)DBNull.Value);
            Params[4] = new SqlParameter("@ToDate", SearchModel.ToDate ?? (object)DBNull.Value);

            var result = _sQLHelper.ExecuteDataTable("[HR].[SP_GetPayrollReportOverTimes]", Params, null);
            return result;
        }

        public DataTable GetPayrollReportPenalties(SearchFilterModel SearchModel)
        {
            var SearchText = SearchModel.FilterModel.FilterItems.Where(x => x.CategoryName == "SearchText").Select(x => x.ItemFlag).FirstOrDefault();

            SqlParameter[] Params = new SqlParameter[5];
            Params[0] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            Params[1] = new SqlParameter("@PageSize", SearchModel.PageSize);
            Params[2] = new SqlParameter("@SearchText", SearchText ?? (object)DBNull.Value);
            Params[3] = new SqlParameter("@FromDate", SearchModel.FromDate ?? (object)DBNull.Value);
            Params[4] = new SqlParameter("@ToDate", SearchModel.ToDate ?? (object)DBNull.Value);

            var result = _sQLHelper.ExecuteDataTable("[HR].[SP_GetPayrollReportPenalties]", Params, null);
            return result;
        }

        public DataTable GetPayrollReportSickLeaves(SearchFilterModel SearchModel)
        {
            var SearchText = SearchModel.FilterModel.FilterItems.Where(x => x.CategoryName == "SearchText").Select(x => x.ItemFlag).FirstOrDefault();

            SqlParameter[] Params = new SqlParameter[5];
            Params[0] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            Params[1] = new SqlParameter("@PageSize", SearchModel.PageSize);
            Params[2] = new SqlParameter("@SearchText", SearchText ?? (object)DBNull.Value);
            Params[3] = new SqlParameter("@FromDate", SearchModel.FromDate ?? (object)DBNull.Value);
            Params[4] = new SqlParameter("@ToDate", SearchModel.ToDate ?? (object)DBNull.Value);

            var result = _sQLHelper.ExecuteDataTable("[HR].[SP_GetPayrollReportSickLeaves]", Params, null);
            return result;
        }

        public DataTable GetPayrollReportDeducts(SearchFilterModel SearchModel)
        {
            var SearchText = SearchModel.FilterModel.FilterItems.Where(x => x.CategoryName == "SearchText").Select(x => x.ItemFlag).FirstOrDefault();

            SqlParameter[] Params = new SqlParameter[5];
            Params[0] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            Params[1] = new SqlParameter("@PageSize", SearchModel.PageSize);
            Params[2] = new SqlParameter("@SearchText", SearchText ?? (object)DBNull.Value);
            Params[3] = new SqlParameter("@FromDate", SearchModel.FromDate ?? (object)DBNull.Value);
            Params[4] = new SqlParameter("@ToDate", SearchModel.ToDate ?? (object)DBNull.Value);

            var result = _sQLHelper.ExecuteDataTable("[HR].[SP_GetPayrollReportDeducts]", Params, null);
            return result;
        }

        public DataTable GetPayrollReportAdvances(SearchFilterModel SearchModel)
        {
            var SearchText = SearchModel.FilterModel.FilterItems.Where(x => x.CategoryName == "SearchText").Select(x => x.ItemFlag).FirstOrDefault();

            SqlParameter[] Params = new SqlParameter[5];
            Params[0] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            Params[1] = new SqlParameter("@PageSize", SearchModel.PageSize);
            Params[2] = new SqlParameter("@SearchText", SearchText ?? (object)DBNull.Value);
            Params[3] = new SqlParameter("@FromDate", SearchModel.FromDate ?? (object)DBNull.Value);
            Params[4] = new SqlParameter("@ToDate", SearchModel.ToDate ?? (object)DBNull.Value);

            var result = _sQLHelper.ExecuteDataTable("[HR].[SP_GetPayrollReportAdvances]", Params, null);
            return result;
        }

        public DataTable GetPayrollReportEmployeesDues(SearchFilterModel SearchModel)
        {
            var SearchText = SearchModel.FilterModel.FilterItems.Where(x => x.CategoryName == "SearchText").Select(x => x.ItemFlag).FirstOrDefault();

            SqlParameter[] Params = new SqlParameter[5];
            Params[0] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            Params[1] = new SqlParameter("@PageSize", SearchModel.PageSize);
            Params[2] = new SqlParameter("@SearchText", SearchText ?? (object)DBNull.Value);
            Params[3] = new SqlParameter("@FromDate", SearchModel.FromDate ?? (object)DBNull.Value);
            Params[4] = new SqlParameter("@ToDate", SearchModel.ToDate ?? (object)DBNull.Value);

            var result = _sQLHelper.ExecuteDataTable("[HR].[SP_GetPayrollReportEmployeesDues]", Params, null);
            return result;
        }

        public ActionsResponseModel ExportPayrollReportVacations(SearchFilterModel model)
        {
            string url = string.Empty;
            try
            {
                model.PageSize = 50000;
                var dtExport = GetPayrollReportVacations(model);
                dtExport.Columns.Remove("TotalCount");
                dtExport.Columns.Remove("EmployeeID");
                url = GetExportUrl(dtExport, "Employee Vacations Report");

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
                    Message = "Server error",
                };
            }
        }

        public ActionsResponseModel ExportPayrollReportOverTime(SearchFilterModel model)
        {
            string url = string.Empty;
            try
            {
                model.PageSize = 50000;
                var dtExport = GetPayrollReportOverTime(model);
                dtExport.Columns.Remove("TotalCount");
                dtExport.Columns.Remove("EmployeeID");
                url = GetExportUrl(dtExport, "Employee OverTime Report");

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
                    Message = "Server error",
                };
            }
        }

        public ActionsResponseModel ExportPayrollReportPenalties(SearchFilterModel model)
        {
            string url = string.Empty;
            try
            {
                model.PageSize = 50000;
                var dtExport = GetPayrollReportPenalties(model);
                dtExport.Columns.Remove("TotalCount");
                dtExport.Columns.Remove("EmployeeID");
                url = GetExportUrl(dtExport, "Employee Penalties Report");

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
                    Message = "Server error",
                };
            }
        }

        public ActionsResponseModel ExportPayrollReportSickLeaves(SearchFilterModel model)
        {
            string url = string.Empty;
            try
            {
                model.PageSize = 50000;
                var dtExport = GetPayrollReportSickLeaves(model);
                dtExport.Columns.Remove("TotalCount");
                dtExport.Columns.Remove("EmployeeID");
                url = GetExportUrl(dtExport, "Employee SickLeaves Report");

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
                    Message = "Server error",
                };
            }
        }

        public ActionsResponseModel ExportPayrollReportDeducts(SearchFilterModel model)
        {
            string url = string.Empty;
            try
            {
                model.PageSize = 50000;
                var dtExport = GetPayrollReportDeducts(model);
                dtExport.Columns.Remove("TotalCount");
                dtExport.Columns.Remove("EmployeeID");
                url = GetExportUrl(dtExport, "Employee Deducts Report");

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
                    Message = "Server error",
                };
            }
        }

        public ActionsResponseModel ExportPayrollReportAdvances(SearchFilterModel model)
        {
            string url = string.Empty;
            try
            {
                model.PageSize = 50000;
                var dtExport = GetPayrollReportAdvances(model);
                dtExport.Columns.Remove("TotalCount");
                dtExport.Columns.Remove("EmployeeID");
                url = GetExportUrl(dtExport, "Employee Advances Report");

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
                    Message = "Server error",
                };
            }
        }

        public ActionsResponseModel ExportPayrollReportEmployeesDues(SearchFilterModel model)
        {
            string url = string.Empty;
            try
            {
                model.PageSize = 50000;
                var dtExport = GetPayrollReportEmployeesDues(model);
                dtExport.Columns.Remove("TotalCount");
                dtExport.Columns.Remove("EmployeeID");
                url = GetExportUrl(dtExport, "Employee Advances Report");

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
                    Message = "Server error",
                };
            }
        }

        #endregion

        #region ExpireReport

        public List<EmployeeReportModel> GetEmployeesExpireReport_Data(int ReportType, DateTime FromDate, DateTime ToDate, SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[6];
            param[0] = new SqlParameter("@ReportType", ReportType);
            param[1] = new SqlParameter("@FromDate", FromDate);
            param[2] = new SqlParameter("@ToDate", ToDate);
            param[3] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            param[4] = new SqlParameter("@PageSize", SearchModel.PageSize);
            param[5] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[5].Value = sharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);

            var result = _sQLHelper.SQLQuery<EmployeeReportModel>("[HR].[SP_GetEmployeesExpireReport_Data]", null, param);

            return result;
        }

        public ActionsResponseModel GetEmployeesExpireReport_Export(int ReportType, DateTime FromDate, DateTime ToDate, SearchFilterModel SearchModel)
        {
            string url = string.Empty;
            try
            {
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 990000;
                var Data = GetEmployeesExpireReport_Data(ReportType, FromDate, ToDate, SearchModel);

                var result = Data.Select(x => new EmployeeExpireReportExportModel
                {
                    EmployeeCode = x.EmployeeCode,
                    EmployeeName = x.EmployeeNameAR ?? x.EmployeeNameEN,
                    IqamaNumber = x.IqamaNumber,
                    Email = x.Email,
                    NationalityName = x.NationalityNameAR ?? x.NationalityNameEN,
                    SponsorName = x.SponsorNameAR ?? x.SponsorNameEN,
                    BirthDate = x.BirthDate?.ToString("MM/dd/yyyy"),
                    JobName = x.JobNameAR ?? x.JobNameEN,
                    BranchName = x.BranchNameAR ?? x.BranchNameEN,
                    JoinDate = x.JoinDate?.ToString("MM/dd/yyyy"),
                    ContractPeriod = x.ContractPeriod,
                    SocialStatus = x.SocialStatusNameAR ?? x.SocialStatusNameEN,
                    WorkStatus = x.EmployeeStatusNameAR ?? x.EmployeeStatusNameEN,
                    Address = x.Address,
                    Phone = x.Phone,
                    ExpiryDate = x.ExpiryDate?.ToString("MM/dd/yyyy"),
                    Notes = x.Notes
                }).ToList();

                if (!result.Any())
                {
                    result.Add(new EmployeeExpireReportExportModel());

                }


                var dtExport = DalHelper.ConvertToDataTable(result, "Employee Expire");


                url = GetExportUrl(dtExport, "Employee Expire");


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

        public List<FilterModel> GetEmployeesExpireReport_Filters(int ReportType, DateTime FromDate, DateTime ToDate, SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[4];
            param[0] = new SqlParameter("@ReportType", ReportType);
            param[1] = new SqlParameter("@FromDate", FromDate);
            param[2] = new SqlParameter("@ToDate", ToDate);
            param[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[3].Value = sharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);

            var result = _sQLHelper.SQLQuery<FilterItem>("[HR].[SP_GetEmployeesExpireReport_Filters]", null, param);
            var grouped = sharedFilterService.GroupedFilterItems(result);

            return grouped;
        }

        #endregion

        #region NewComerEmployeesReport
        public List<EmployeeReportModel> GetNewComerEmployeesReport_Data(DateTime? FromDate, DateTime? ToDate, SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@FromDate", FromDate);
            param[1] = new SqlParameter("@ToDate", ToDate);
            param[2] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            param[3] = new SqlParameter("@PageSize", SearchModel.PageSize);
            param[4] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[4].Value = sharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);


            var result = _sQLHelper.SQLQuery<EmployeeReportModel>("[HR].[SP_GetNewComerEmployeesReport_Data]", null, param);

            return result;
        }
        public ActionsResponseModel GetNewComerEmployeesReport_Export(DateTime? FromDate, DateTime? ToDate, SearchFilterModel SearchModel)
        {
            string url = string.Empty;
            try
            {
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 990000;
                var Data = GetNewComerEmployeesReport_Data(FromDate, ToDate, SearchModel);

                var result = Data.Select(x => new EmployeeExpireReportExportModel
                {
                    EmployeeCode = x.EmployeeCode,
                    EmployeeName = x.EmployeeNameAR ?? x.EmployeeNameEN,
                    IqamaNumber = x.IqamaNumber,
                    Email = x.Email,
                    NationalityName = x.NationalityNameAR ?? x.NationalityNameEN,
                    SponsorName = x.SponsorNameAR ?? x.SponsorNameEN,
                    BirthDate = x.BirthDate?.ToString("MM/dd/yyyy"),
                    JobName = x.JobNameAR ?? x.JobNameEN,
                    BranchName = x.BranchNameAR ?? x.BranchNameEN,
                    JoinDate = x.JoinDate?.ToString("MM/dd/yyyy"),
                    ContractPeriod = x.ContractPeriod,
                    SocialStatus = x.SocialStatusNameAR ?? x.SocialStatusNameEN,
                    WorkStatus = x.EmployeeStatusNameAR ?? x.EmployeeStatusNameEN,
                    Address = x.Address,
                    Phone = x.Phone,
                    ExpiryDate = x.ExpiryDate?.ToString("MM/dd/yyyy"),
                    Notes = x.Notes
                }).ToList();

                if (!result.Any())
                {
                    result.Add(new EmployeeExpireReportExportModel());

                }


                var dtExport = DalHelper.ConvertToDataTable(result, "New Come Employees");


                url = GetExportUrl(dtExport, "New Come Employees");


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

        public List<FilterModel> GetNewComerEmployeesReport_Filters(DateTime? FromDate, DateTime? ToDate, SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@FromDate", FromDate);
            param[1] = new SqlParameter("@ToDate", ToDate);
            param[2] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[2].Value = sharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);

            var result = _sQLHelper.SQLQuery<FilterItem>("[HR].[SP_GetNewComerEmployeesReport_Filters]", null, param);
            var grouped = sharedFilterService.GroupedFilterItems(result);

            return grouped;
        }
        #endregion

        #region EmployeeSalaryAnnualIncreaseReport
        public List<SalaryAnnualIncreaseModel> GetEmployeeSalaryAnnualIncreaseReport_Data(SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[3];

            param[0] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            param[1] = new SqlParameter("@PageSize", SearchModel.PageSize);
            param[2] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[2].Value = sharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);


            var result = _sQLHelper.SQLQuery<SalaryAnnualIncreaseModel>("[HR].[SP_GetEmployeeSalaryAnnualIncrease_Data]", null, param);

            return result;
        }
        public ActionsResponseModel GetEmployeeSalaryAnnualIncreaseReport_Export(SearchFilterModel SearchModel)
        {
            string url = string.Empty;
            try
            {
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 990000;
                var Data = GetEmployeeSalaryAnnualIncreaseReport_Data(SearchModel);

                var result = Data.Select(x => new EmployeeExpireReportExportModel
                {
                    EmployeeCode = x.EmployeeCode,
                    EmployeeName = x.EmployeeNameAR ?? x.EmployeeNameEN,
                    IqamaNumber = x.IqamaNumber,
                    Email = x.Email,
                    NationalityName = x.NationalityNameAR ?? x.NationalityNameEN,
                    SponsorName = x.SponsorNameAR ?? x.SponsorNameEN,
                    BirthDate = x.BirthDate?.ToString("MM/dd/yyyy"),
                    JobName = x.JobNameAR ?? x.JobNameEN,
                    BranchName = x.BranchNameAR ?? x.BranchNameEN,
                    JoinDate = x.JoinDate?.ToString("MM/dd/yyyy"),
                    ContractPeriod = x.ContractPeriod,
                    SocialStatus = x.SocialStatusNameAR ?? x.SocialStatusNameEN,
                    WorkStatus = x.EmployeeStatusNameAR ?? x.EmployeeStatusNameEN,
                    Address = x.Address,
                    Phone = x.Phone,
                    ExpiryDate = x.ExpiryDate?.ToString("MM/dd/yyyy"),
                    Notes = x.Notes
                }).ToList();

                if (!result.Any())
                {
                    result.Add(new EmployeeExpireReportExportModel());

                }


                var dtExport = DalHelper.ConvertToDataTable(result, "Employee Salary Annual Increase");


                url = GetExportUrl(dtExport, "Employee Salary Annual Increase");


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

        public List<FilterModel> GetEmployeeSalaryAnnualIncreaseReport_Filters(SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[1];

            param[0] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[0].Value = sharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);

            var result = _sQLHelper.SQLQuery<FilterItem>("[HR].[SP_GetEmployeeSalaryAnnualIncreaseReport_Filters]", null, param);
            var grouped = sharedFilterService.GroupedFilterItems(result);

            return grouped;
        }

        public List<SalaryHistoryModel> GetEmployeeSalaryHistory_Data(int EmployeeId, SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[4];

            param[0] = new SqlParameter("@EmployeeId", EmployeeId);
            param[1] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            param[2] = new SqlParameter("@PageSize", SearchModel.PageSize);
            param[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[3].Value = sharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);


            var result = _sQLHelper.SQLQuery<SalaryHistoryModel>("[HR].[SP_GetEmployeeSalaryHistory_Data]", null, param);

            return result;
        }
        public ActionsResponseModel GetEmployeeSalaryHistory_Export(int EmployeeId, SearchFilterModel SearchModel)
        {
            string url = string.Empty;
            try
            {
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 990000;
                var Data = GetEmployeeSalaryHistory_Data(EmployeeId, SearchModel);

                var result = Data.Select(x => new SalaryHistoryExportModel
                {
                    EmployeeName = x.EmployeeNameAR ?? x.EmployeeNameEN,
                    CreatedDate = x.CreatedDate?.ToString("MM/dd/yyyy"),
                    BasicSalary = x.BasicSalary,
                    GrossSalary = x.GrossSalary,
                    ExtraSalary = x.ExtraSalary,
                    HousingAllowance = x.HousingAllowance,
                    MealAllowance = x.MealAllowance,
                    MobileAllowance = x.MobileAllowance,
                    Other = x.Other,
                    Transportation = x.Transportation,
                    WorkNature = x.WorkNature,
                    TotalSalary = x.TotalSalary
                }).ToList();

                if (!result.Any())
                {
                    result.Add(new SalaryHistoryExportModel());

                }


                var dtExport = DalHelper.ConvertToDataTable(result, "Employee Salary History");


                url = GetExportUrl(dtExport, "Employee Salary History");


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

        #endregion

        #region Salaries Report

        public List<EmployeeSalarySummaryModel> GetSalariesReport_Data(int Month, int Year, SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@Month", Month);
            param[1] = new SqlParameter("@Year", Year);
            param[2] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            param[3] = new SqlParameter("@PageSize", SearchModel.PageSize);
            param[4] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[4].Value = sharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);


            var result = _sQLHelper.SQLQuery<EmployeeSalarySummaryModel>("[HR].[SP_GetSalariesReport_Data]", null, param);

            return result;
        }

        public ActionsResponseModel GetSalariesReport_Export(int Month, int Year, SearchFilterModel SearchModel)
        {
            string url = string.Empty;
            try
            {
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 990000;
                var data = GetSalariesReport_Data(Month, Year, SearchModel);

                var result = data.Select(x => new EmployeeSalarySummaryModel
                {
                    EmployeeCode = x.EmployeeCode,
                    BranchNameEN = x.BranchNameEN,
                    EmployeeNameEN = x.EmployeeNameEN,
                    AbsentDays = x.AbsentDays,
                    BasicSalary = x.BasicSalary,
                    GrossSalary = x.GrossSalary,
                    ExtraSalary = x.ExtraSalary,
                    Penalties = x.Penalties,
                    Advances = x.Advances,
                    HousingAllowance = x.HousingAllowance,
                    MealAllowance = x.MealAllowance,
                    MobileAllowance = x.MobileAllowance,
                    NetSalary = x.NetSalary,
                    Other = x.Other,
                    Overtime = x.Overtime,
                    SickDays = x.SickDays,
                    TotalDeductions = x.TotalDeductions,
                    Transportation = x.Transportation,
                    WorkNature = x.WorkNature,
                    TotalSalary = x.TotalSalary
                }).ToList();

                if (!result.Any())
                {
                    result.Add(new EmployeeSalarySummaryModel());

                }

                var dtExport = DalHelper.ConvertToDataTable(result, "Monthly Salary Report");

                url = GetExportUrl(dtExport, "Monthly Salary Report");

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

        public List<FilterModel> GetSalariesReport_Filters(int Month, int Year, SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@Month", Month);
            param[1] = new SqlParameter("@Year", Year);
            param[2] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[2].Value = sharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);

            var result = _sQLHelper.SQLQuery<FilterItem>("[HR].[SP_GetSalariesReport_Filters]", null, param);
            var grouped = sharedFilterService.GroupedFilterItems(result);

            return grouped;
        }

        #endregion

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
