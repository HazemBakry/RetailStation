using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Common.Export;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.DTOs.Inventory;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.Inventory;
using MasterErp.Interface.Common;
using MasterErp.Interface.Inventory;
using MasterErp.Service.Common;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.Inventory
{
    public class InventoryReportsService : IInventoryReportsService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly IExportService ExportService;
        private readonly ISharedFilterService SharedFilterService;
        private string ConnectionString;

        public InventoryReportsService(DBContext Context, ISQLHelper SQLHelper, IExportService _ExportService,
            IConfiguration Configuration, ISharedFilterService SharedFilterService)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.Configuration = Configuration;
            this.SharedFilterService = SharedFilterService;
            this.ExportService = _ExportService;
            this.ConnectionString = Configuration.GetConnectionString("DBConnection");
        }

        public List<OrderDetailsDto> GetItemsPricesFollowUp_Data(DateTime FromDate, DateTime ToDate, SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@FromDate", FromDate);
            param[1] = new SqlParameter("@ToDate", ToDate);
            param[2] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            param[3] = new SqlParameter("@PageSize", SearchModel.PageSize);
            param[4] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[4].Value = SharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);

            var result = SQLHelper.SQLQuery<OrderDetailsDto>("[Purchase].[SP_GetItemsPricesFollowUp_Data]", null, param);

            return result;
        }

        public ActionsResponseModel GetItemsPricesFollowUp_Export(DateTime FromDate, DateTime ToDate, SearchFilterModel SearchModel)
        {
            string url = string.Empty;
            try
            {
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 990000;
                var Data = GetItemsPricesFollowUp_Data(FromDate, ToDate, SearchModel);

                var result = Data.Select(x => new ItemDto
                {
                    // NameAR = x.EmployeeCode,
                    //EmployeeName = x.EmployeeNameAR ?? x.EmployeeNameEN,
                    //IqamaNumber = x.IqamaNumber,
                    //Email = x.Email,
                    //NationalityName = x.NationalityNameAR ?? x.NationalityNameEN,
                    //SponsorName = x.SponsorNameAR ?? x.SponsorNameEN,
                    //BirthDate = x.BirthDate?.ToString("MM/dd/yyyy"),
                    //JobName = x.JobNameAR ?? x.JobNameEN,
                    //BranchName = x.BranchNameAR ?? x.BranchNameEN,
                    //JoinDate = x.JoinDate?.ToString("MM/dd/yyyy"),
                    //ContractPeriod = x.ContractPeriod,
                    //SocialStatus = x.SocialStatusNameAR ?? x.SocialStatusNameEN,
                    //WorkStatus = x.EmployeeStatusNameAR ?? x.EmployeeStatusNameEN,
                    //Address = x.Address,
                    //Phone = x.Phone,
                    //ExpiryDate = x.ExpiryDate?.ToString("MM/dd/yyyy"),
                    //Notes = x.Notes
                }).ToList();

                if (!result.Any())
                {
                    result.Add(new ItemDto());
                }

                var dtExport = DalHelper.ConvertToDataTable(result, "Item FollowUp");

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

        public List<FilterModel> GetItemsPricesFollowUp_Filters(DateTime FromDate, DateTime ToDate, SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@FromDate", FromDate);
            param[1] = new SqlParameter("@ToDate", ToDate);
            param[2] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[2].Value = SharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);

            var result = SQLHelper.SQLQuery<FilterItem>("[Purchase].[SP_GetItemsPricesFollowUp_Filters]", null, param);
            var grouped = SharedFilterService.GroupedFilterItems(result);

            return grouped;
        }


        public List<OrderDetailsDto> GetReceivedItemsReport_Data(DateTime FromDate, DateTime ToDate, SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@FromDate", FromDate);
            param[1] = new SqlParameter("@ToDate", ToDate);
            param[2] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            param[3] = new SqlParameter("@PageSize", SearchModel.PageSize);
            param[4] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[4].Value = SharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);

            var result = SQLHelper.SQLQuery<OrderDetailsDto>("[Purchase].[SP_GetReceivedItemsReport_Data]", null, param);
            return result;
        }

        public ActionsResponseModel GetReceivedItemsReport_Export(DateTime FromDate, DateTime ToDate, SearchFilterModel SearchModel)
        {
            string url = string.Empty;
            try
            {
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 990000;
                var Data = GetItemsPricesFollowUp_Data(FromDate, ToDate, SearchModel);

                var result = Data.Select(x => new ItemDto
                {
                    // NameAR = x.EmployeeCode,
                    //EmployeeName = x.EmployeeNameAR ?? x.EmployeeNameEN,
                    //IqamaNumber = x.IqamaNumber,
                    //Email = x.Email,
                    //NationalityName = x.NationalityNameAR ?? x.NationalityNameEN,
                    //SponsorName = x.SponsorNameAR ?? x.SponsorNameEN,
                    //BirthDate = x.BirthDate?.ToString("MM/dd/yyyy"),
                    //JobName = x.JobNameAR ?? x.JobNameEN,
                    //BranchName = x.BranchNameAR ?? x.BranchNameEN,
                    //JoinDate = x.JoinDate?.ToString("MM/dd/yyyy"),
                    //ContractPeriod = x.ContractPeriod,
                    //SocialStatus = x.SocialStatusNameAR ?? x.SocialStatusNameEN,
                    //WorkStatus = x.EmployeeStatusNameAR ?? x.EmployeeStatusNameEN,
                    //Address = x.Address,
                    //Phone = x.Phone,
                    //ExpiryDate = x.ExpiryDate?.ToString("MM/dd/yyyy"),
                    //Notes = x.Notes
                }).ToList();

                if (!result.Any())
                {
                    result.Add(new ItemDto());
                }

                var dtExport = DalHelper.ConvertToDataTable(result, "Item FollowUp");

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

        public List<FilterModel> GetReceivedItemsReport_Filters(DateTime FromDate, DateTime ToDate, SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@FromDate", FromDate);
            param[1] = new SqlParameter("@ToDate", ToDate);
            param[2] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[2].Value = SharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);

            var result = SQLHelper.SQLQuery<FilterItem>("[Purchase].[SP_GetReceivedItemsReport_Filters]", null, param);
            var grouped = SharedFilterService.GroupedFilterItems(result);

            return grouped;
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
            return ExportService.Export(exportTemplateBase, DT);
        }
    }
}
