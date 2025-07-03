using MasterErp.Entities.Models;
using MasterErp.Entities.Models.HR;
using MasterErp.Interface.Auth;
using MasterErp.Interface.Common;
using MasterErp.Interface.EmployeeProfile;
using MasterErp.Interface.GeneralAccounts;
using MasterErp.Interface.GeneralAccounts.Customers;
using MasterErp.Interface.GeneralAccounts.GeneralAccountSettings;
using MasterErp.Interface.HR;
using MasterErp.Interface.Inventory;
using MasterErp.Interface.Purchase;
using MasterErp.Interface.Sales;
using MasterErp.Interface.Shared;
using MasterErp.Service.Auth;
using MasterErp.Service.Common;
using MasterErp.Service.EmployeeProfile;
using MasterErp.Service.GeneralAccounts;
using MasterErp.Service.GeneralAccounts.Customers;
using MasterErp.Service.GeneralAccounts.GeneralAccountSettings;
using MasterErp.Service.HR;
using MasterErp.Service.Inventory;
using MasterErp.Service.Purchase;
using MasterErp.Service.Sales;
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

            services.AddScoped<IFileService, FileService>();
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
            services.AddScoped<IItemsService, ItemsService>();
            services.AddScoped<ISharedFilterService, SharedFilterService>();
            services.AddScoped<IGeneralAccountsReportService, GeneralAccountsReportService>();
            services.AddScoped<ISupplierReturnsVoucherService, SupplierReturnsVoucherService>();
            services.AddScoped<IReceiptLedgerService, ReceiptLedgerService>();
            services.AddScoped<IFinancialPeriodService, FinancialPeriodService>();
            services.AddScoped<IExportService, ExportService>();
            services.AddScoped<IEmployeeProfileService, EmployeeProfileService>();
            services.AddScoped<ILoansService, LoansService>();
            services.AddScoped<ISuppliersService, SuppliersService>();
            services.AddScoped<IPaymentTermService, PaymentTermService>();
            services.AddScoped<ITaxCalculationService, TaxCalculationService>();
            services.AddScoped<IDailyNotebookService, DailyNotebookService>();
            services.AddScoped<IAssetsFormService, AssetsFormService>();
            services.AddScoped<ILoansFormService, LoansFormService>();
            services.AddScoped<IBatchService, BatchService>();
            services.AddScoped<ICustomerService, CustomerService>();
            services.AddScoped<IDataImportService, DataImportService>();
            services.AddScoped<ILookupService, LookupService>();
            services.AddScoped<ITenantService, TenantService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ICreateReportService, CreateReportService>();
            services.AddScoped<IHelper, Helper>();
            services.AddScoped<IEmployeeAdvancesService, EmployeeAdvancesService>();
            services.AddScoped<IHRReportsService, HRReportsService>();
            services.AddScoped<IHRService, HRService>();
            services.AddScoped<ISalariesService, SalariesService>();

        }
    }
}
