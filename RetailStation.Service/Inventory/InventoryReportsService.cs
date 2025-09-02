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

        public List<OrderReportModel> GetItemsPricesFollowUp_Data(DateTime? FromDate, DateTime? ToDate, SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@FromDate", FromDate);
            param[1] = new SqlParameter("@ToDate", ToDate);
            param[2] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            param[3] = new SqlParameter("@PageSize", SearchModel.PageSize);
            param[4] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[4].Value = SharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);

            var result = SQLHelper.SQLQuery<OrderReportModel>("[Purchase].[SP_GetItemsPricesFollowUp_Data]", null, param);

            return result;
        }

        public ActionsResponseModel GetItemsPricesFollowUp_Export(DateTime? FromDate, DateTime? ToDate, SearchFilterModel SearchModel)
        {
            string url = string.Empty;
            try
            {
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 990000;
                var Data = GetItemsPricesFollowUp_Data(FromDate, ToDate, SearchModel);

                var result = Data.Select(x => new OrderReportExportModel
                {
                    Code = x.Code,
                    Barcode = x.Barcode,
                    ItemName = x.ItemNameAR ?? x.ItemNameEN,
                    CategoryName = x.CategoryNameAR ?? x.CategoryNameEN,
                    OrderNumber = x.OrderNumber,
                    SerialNumber = x.SerialNumber,
                    OrderDate = x.OrderDate?.ToString("MM/dd/yyyy"),
                    Price = x.Price,
                    Quantity = x.Quantity,
                    SupplierName = x.SupplierNameAR ?? x.SupplierNameEN
                }).ToList();


                if (!result.Any())
                {
                    result.Add(new OrderReportExportModel());
                }

                var dtExport = DalHelper.ConvertToDataTable(result, "Item FollowUp");

                url = GetExportUrl(dtExport, "Item FollowUp");

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

        public List<FilterModel> GetItemsPricesFollowUp_Filters(DateTime? FromDate, DateTime? ToDate, SearchFilterModel SearchModel)
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

        #region Received Items Summary Report
        public List<OrderDetailsReportModel> GetReceivedItemsSummaryReport_Data(DateTime? FromDate, DateTime? ToDate, SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@FromDate", FromDate);
            param[1] = new SqlParameter("@ToDate", ToDate);
            param[2] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            param[3] = new SqlParameter("@PageSize", SearchModel.PageSize);
            param[4] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[4].Value = SharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);

            var result = SQLHelper.SQLQuery<OrderDetailsReportModel>("[Inventory].[SP_GetReceivedItemsSummaryReport_Data]", null, param);
            return result;
        }

        public ActionsResponseModel GetReceivedItemsSummaryReport_Export(DateTime? FromDate, DateTime? ToDate, SearchFilterModel SearchModel)
        {
            string url = string.Empty;
            try
            {
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 990000;
                var Data = GetReceivedItemsSummaryReport_Data(FromDate, ToDate, SearchModel);

                var result = Data.Select(x => new OrderDetailsReportExportModel
                {
                    Code = x.Code,
                    Barcode = x.Barcode,
                    ItemName = x.ItemNameAR ?? x.ItemNameEN,
                    CategoryName = x.CategoryNameAR ?? x.CategoryNameEN,
                    TotalValue = x.TotalValue,
                    Price = x.Price,
                    Quantity = x.Quantity,
                }).ToList();

                if (!result.Any())
                {
                    result.Add(new OrderDetailsReportExportModel());
                }

                var dtExport = DalHelper.ConvertToDataTable(result, "Received Items Summary");
                url = GetExportUrl(dtExport, "Received Items Summary");

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

        public List<FilterModel> GetReceivedItemsSummaryReport_Filters(DateTime? FromDate, DateTime? ToDate, SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@FromDate", FromDate);
            param[1] = new SqlParameter("@ToDate", ToDate);
            param[2] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[2].Value = SharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);

            var result = SQLHelper.SQLQuery<FilterItem>("[Inventory].[SP_GetReceivedItemsSummaryReport_Filters]", null, param);
            var grouped = SharedFilterService.GroupedFilterItems(result);
            return grouped;
        }
        #endregion

        #region Received Items Details Report
        public List<OrderReportModel> GetReceivedItemsDetailsReport_Data(DateTime? FromDate, DateTime? ToDate, SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@FromDate", FromDate);
            param[1] = new SqlParameter("@ToDate", ToDate);
            param[2] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            param[3] = new SqlParameter("@PageSize", SearchModel.PageSize);
            param[4] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[4].Value = SharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);

            var result = SQLHelper.SQLQuery<OrderReportModel>("[Inventory].[SP_GetReceivedItemsDetailsReport_Data]", null, param);
            return result;
        }

        public ActionsResponseModel GetReceivedItemsDetailsReport_Export(DateTime? FromDate, DateTime? ToDate, SearchFilterModel SearchModel)
        {
            string url = string.Empty;
            try
            {
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 990000;
                var Data = GetReceivedItemsDetailsReport_Data(FromDate, ToDate, SearchModel);

                var result = Data.Select(x => new OrderReportExportModel
                {
                    Code = x.Code,
                    Barcode = x.Barcode,
                    ItemName = x.ItemNameAR ?? x.ItemNameEN,
                    CategoryName = x.CategoryNameAR ?? x.CategoryNameEN,
                    OrderNumber = x.OrderNumber,
                    SerialNumber = x.SerialNumber,
                    OrderDate = x.OrderDate?.ToString("MM/dd/yyyy"),
                    Price = x.Price,
                    Quantity = x.Quantity,
                    SupplierName = x.SupplierNameAR ?? x.SupplierNameEN
                }).ToList();

                if (!result.Any())
                {
                    result.Add(new OrderReportExportModel());
                }

                var dtExport = DalHelper.ConvertToDataTable(result, "Received Items Details");
                url = GetExportUrl(dtExport, "Received Items Details");

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

        public List<FilterModel> GetReceivedItemsDetailsReport_Filters(DateTime? FromDate, DateTime? ToDate, SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@FromDate", FromDate);
            param[1] = new SqlParameter("@ToDate", ToDate);
            param[2] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[2].Value = SharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);

            var result = SQLHelper.SQLQuery<FilterItem>("[Purchase].[SP_GetReceivedItemsDetailsReport_Filters]", null, param);
            var grouped = SharedFilterService.GroupedFilterItems(result);
            return grouped;
        }
        #endregion

        #region Material Receipts Report
        public List<OrderReportModel> GetMaterialReceiptsReport_Data(DateTime? FromDate, DateTime? ToDate, SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@FromDate", FromDate);
            param[1] = new SqlParameter("@ToDate", ToDate);
            param[2] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            param[3] = new SqlParameter("@PageSize", SearchModel.PageSize);
            param[4] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[4].Value = SharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);

            var result = SQLHelper.SQLQuery<OrderReportModel>("[Inventory].[SP_GetMaterialReceiptsReport_Data]", null, param);
            return result;
        }

        public ActionsResponseModel GetMaterialReceiptsReport_Export(DateTime? FromDate, DateTime? ToDate, SearchFilterModel SearchModel)
        {
            string url = string.Empty;
            try
            {
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 990000;
                var Data = GetMaterialReceiptsReport_Data(FromDate, ToDate, SearchModel);

                var result = Data.Select(x => new MaterialReciptReportExportModel
                {

                    OrderNumber = x.OrderNumber,
                    OrderDate = x.OrderDate?.ToString("MM/dd/yyyy"),
                    SerialNumber = x.SerialNumber,
                    DocNumber = x.DocNumber,
                    TotalValue = x.TotalValue,
                    PurchaseOrder = x.PurchaseOrder,
                    PurchaseInvoice = x.PurchaseInvoice,
                    Status = x.WorkflowStatusNameAR ?? x.WorkflowStatusNameEN,
                    SupplierName = x.SupplierNameAR ?? x.SupplierNameEN,
                    StoreName = x.StoreNameAR ?? x.StoreNameEN,
                }).ToList();

                if (!result.Any())
                {
                    result.Add(new MaterialReciptReportExportModel());
                }

                var dtExport = DalHelper.ConvertToDataTable(result, "Material Receipts");
                url = GetExportUrl(dtExport, "Material Receipts");

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

        public List<FilterModel> GetMaterialReceiptsReport_Filters(DateTime? FromDate, DateTime? ToDate, SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@FromDate", FromDate);
            param[1] = new SqlParameter("@ToDate", ToDate);
            param[2] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[2].Value = SharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);

            var result = SQLHelper.SQLQuery<FilterItem>("[Purchase].[SP_GetMaterialReceiptsReport_Filters]", null, param);
            var grouped = SharedFilterService.GroupedFilterItems(result);
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
            return ExportService.Export(exportTemplateBase, DT);
        }
    }
}


