using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Enums;
using RetailStation.Entities.Common.Export;
using RetailStation.Entities.DTOs.Inventory;
using RetailStation.Entities.Models;
using RetailStation.Interface.Common;
using RetailStation.Service.Common;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using RetailStation.Interface.Operation;
using RetailStation.Entities.Models.Operation;
using RetailStation.Entities.DTOs.Operation;
using RetailStation.Interface.SupplierManagement;
using RetailStation.Interface.Dashboard;

namespace RetailStation.Service.Dashboard
{
    public class DashboardService : IDashboardService
    {
        private readonly DBContext Context;
        private readonly LookupsDbContext LookupsDbContext;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly ISharedFilterService SharedFilterService;
        private readonly string ConnectionString;
        private readonly IExportService ExportService;

        public DashboardService(DBContext Context, ISQLHelper SQLHelper,
            IConfiguration Configuration, IExportService ExportService,
            ISharedFilterService sharedFilterService, LookupsDbContext lookupsDbContext)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.Configuration = Configuration;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
            this.ExportService = ExportService;
            SharedFilterService = sharedFilterService;
            LookupsDbContext = lookupsDbContext;
        }
        public List<SupplierItemModel> GetDashboardItems_Data(SearchFilterModel model)
        {
            DataTable dt = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] Params = new SqlParameter[]
            {
                new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value),
                new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value),
                new SqlParameter("@FilterList", SqlDbType.Structured) { Value = dt },
            };

            var result = SQLHelper.SQLQuery<SupplierItemModel>("[Dashboard].[GetDashboardItems_Data]", ConnectionString, Params);
            return result;

        }
        public List<FilterModel> GetDashboardItems_Filters(SearchFilterModel model)
        {
            DataTable dt = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] Params = new SqlParameter[]
            {
                new SqlParameter("@FilterList", SqlDbType.Structured) { Value = dt },
            };

            var result = SQLHelper.SQLQuery<FilterItem>("[Dashboard].[GetDashboardItems_Filters]", ConnectionString, Params);
            var grouped = SharedFilterService.GroupedFilterItems(result);
            return grouped;

        }
        public SupplierItemModel GetDashboardItemDetailsById(int SupplierItemId)
        {
            return GetDashboardItems_Data(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }).FirstOrDefault();
        }
    }
}
