using RetailStation.Entities.Models;
using RetailStation.Entities.Models.HR;
using RetailStation.Interface.Auth;
using RetailStation.Interface.Common;
using RetailStation.Interface.EmployeeProfile;
using RetailStation.Interface.GeneralAccounts;
using RetailStation.Interface.GeneralAccounts.Customers;
using RetailStation.Interface.GeneralAccounts.GeneralAccountSettings;
using RetailStation.Interface.HR;
using RetailStation.Interface.Inventory;
using RetailStation.Interface.Purchase;
using RetailStation.Interface.Sales;
using RetailStation.Interface.Shared;
using RetailStation.Service.Auth;
using RetailStation.Service.Common;
using RetailStation.Service.EmployeeProfile;
using RetailStation.Service.GeneralAccounts;
using RetailStation.Service.GeneralAccounts.Customers;
using RetailStation.Service.GeneralAccounts.GeneralAccountSettings;
using RetailStation.Service.HR;
using RetailStation.Service.Inventory;
using RetailStation.Service.Purchase;
using RetailStation.Service.Sales;
using RetailStation.Service.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using RetailStation.Interface.Roles;
using RetailStation.Service.Roles;
using RetailStation.Interfaces.Subscription;
using RetailStation.Services.Subscription;
using RetailStation.Interface.Users;
using RetailStation.Service.Users;
using RetailStation.Interface.Branches;
using RetailStation.Service.Branches;
using RetailStation.Service.Operation;
using RetailStation.Interface.Operation;

namespace RetailStation.API
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
            services.AddScoped<IRolesService, RolesService>();
            services.AddScoped<ISubscribersService, SubscribersService>();
            services.AddScoped<IUsersService, UsersService>();
            services.AddScoped<IBranchesService, BranchesService>();

            services.AddScoped<ICreateReportService, CreateReportService>();
            services.AddScoped<IHelper, Helper>();
            services.AddScoped<IEmployeeAdvancesService, EmployeeAdvancesService>();
            services.AddScoped<IHRReportsService, HRReportsService>();
            services.AddScoped<IHRService, HRService>();
            services.AddScoped<ISalariesService, SalariesService>();
            services.AddScoped<IBankService, BankService>();
            services.AddScoped<IFinancialCustodyService, FinancialCustodyService>();
            services.AddScoped<IInventoryReportsService, InventoryReportsService>();



            

        }
    }
}
