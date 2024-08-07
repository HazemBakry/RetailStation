using MasterErp.Interface.Common;
using MasterErp.Interface.EmployeeProfile;
using MasterErp.Interface.Finance.GeneralAccounts;
using MasterErp.Interface.Finance.Purchase;
using MasterErp.Interface.Finance.Sales;
using MasterErp.Interface.HR;
using MasterErp.Interface.Inventory;
using MasterErp.Interface.Shared;
using MasterErp.Service.Common;
using MasterErp.Service.EmployeeProfile;
using MasterErp.Service.Finance.GeneralAccounts;
using MasterErp.Service.Finance.Purchase;
using MasterErp.Service.Finance.Sales;
using MasterErp.Service.HR;
using MasterErp.Service.Inventory;
using MasterErp.Service.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace MasterErp.API
{
    public static class Strapping
    {
        public static void Bootstrap(IServiceCollection services)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddScoped<ISQLHelper, SQLHelper>();
            services.AddScoped<IEmployeeService, EmployeeService>(); 
            services.AddScoped<IAttendanceService, AttendanceService>();
            services.AddScoped<IOverTimeService, OverTimeService>();
            services.AddScoped<IPenaltyService, PenaltyService>();
            services.AddScoped<ISickLeaveService, SickLeaveService>();
            services.AddScoped<IVacationService, VacationService>();
            services.AddScoped<ICareersService, CareersService>();
            services.AddScoped<IDeductsService, DeductsService>();
            services.AddScoped<IAccountTreeService, AccountTreeService>();
            services.AddScoped<ICostCenterTreeService, CostCenterTreeService>();
            services.AddScoped<IPurchaseInvoiceService, PurchaseInvoiceService>();
            services.AddScoped<IPurchaseOrderService, PurchaseOrderService>();
            services.AddScoped<ISalesInvoiceService, SalesInvoiceService>();
            services.AddScoped<IJournalEntryService, JournalEntryService>();
            services.AddScoped<IInventoryService, InventoryService>();
            services.AddScoped<ISharedService, SharedService>();
            services.AddScoped<IPaymentService, PaymentService>();
            services.AddScoped<IItemService, ItemService>();
            services.AddScoped<ISharedFilterService, SharedFilterService>();
            services.AddScoped<IGeneralAccountsReportService, GeneralAccountsReportService>();
            services.AddScoped<IPurchasesRequestsService, PurchasesRequestsService>();
            services.AddScoped<ISupplierReturnsVoucherService, SupplierReturnsVoucherService>();
            services.AddScoped<IReceiptLedgerService, ReceiptLedgerService>();
            services.AddScoped<IJournalEntryTypeService, JournalEntryTypeService>();
            services.AddScoped<IFinancialPeriodService, FinancialPeriodService>();
            services.AddScoped<IExportService, ExportService>();
            services.AddScoped<IEmployeeProfileService, EmployeeProfileService>();
            services.AddScoped<ILoansService, LoansService>();
        }
    }
}
