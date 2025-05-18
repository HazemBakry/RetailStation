using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Common.Export;
using MasterErp.Interface.Common;
using MasterErp.Interface.HR;
using MasterErp.Service.Common;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.HR
{
    public class PayrollReportService : IPayrollReportService
    {
        private readonly IConfiguration _configuration;
        private readonly IExportService _exportService;
        private readonly ISQLHelper _sQLHelper;
        private string ConnectionString;

        public PayrollReportService(ISQLHelper SQLHelper, IConfiguration Configuration, IExportService exportService)
        {
            _sQLHelper = SQLHelper;
            _configuration = Configuration;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
            _exportService = exportService;
        }

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
