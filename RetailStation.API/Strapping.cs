using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using RetailStation.Entities.Models;
using RetailStation.Interface.Auth;
using RetailStation.Interface.Common;
using RetailStation.Interface.EmployeeProfile;
using RetailStation.Interface.GeneralAccounts;
using RetailStation.Interface.GeneralAccounts.Customers;
using RetailStation.Interface.GeneralAccounts.GeneralAccountSettings;
using RetailStation.Interface.Inventory;
using RetailStation.Interface.Operation;
using RetailStation.Interface.Purchase;
using RetailStation.Interface.Roles;
using RetailStation.Interface.Sales;
using RetailStation.Interface.Shared;
using RetailStation.Interface.SupplierManagement;
using RetailStation.Interface.SystemAdmin;
using RetailStation.Interface.SystemSetting;
using RetailStation.Interface.Users;
using RetailStation.Interface.Website;
using RetailStation.Interfaces.Subscription;
using RetailStation.Service.Auth;
using RetailStation.Service.Common;
using RetailStation.Service.EmployeeProfile;
using RetailStation.Service.GeneralAccounts;
using RetailStation.Service.GeneralAccounts.Customers;
using RetailStation.Service.GeneralAccounts.GeneralAccountSettings;
using RetailStation.Service.Inventory;
using RetailStation.Service.Operation;
using RetailStation.Service.Purchase;
using RetailStation.Service.Roles;
using RetailStation.Service.Sales;
using RetailStation.Service.Shared;
using RetailStation.Service.SupplierManagement;
using RetailStation.Service.SystemAdmin;
using RetailStation.Service.SystemSetting;
using RetailStation.Service.Users;
using RetailStation.Service.Website;
using RetailStation.Services.Subscription;

namespace RetailStation.API
{
    public static class Strapping
    {
        public static void Bootstrap(IServiceCollection services)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddScoped<IFileService, FileService>();
            services.AddScoped<ISQLHelper, SQLHelper>();
            services.AddScoped<IAdminService, AdminService>();
            services.AddScoped<IAccountTreeService, AccountTreeService>();
            services.AddScoped<ICostCenterTreeService, CostCenterTreeService>();
            services.AddScoped<IPurchaseInvoiceService, PurchaseInvoiceService>();
            services.AddScoped<IPurchaseOrderService, PurchaseOrderService>();
            services.AddScoped<ISalesInvoiceService, SalesInvoiceService>();
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
            services.AddScoped<IMerchantsService, MerchantsService>();
            services.AddScoped<ISystemSettingService, SystemSettingService>();
            services.AddScoped<ISuppliersService, SuppliersService>();
            services.AddScoped<ISupplierManagementService, SupplierManagementService>();
            services.AddScoped<IMerchantManagementService, MerchantManagementService>();
            services.AddScoped<IWebsiteService, WebsiteService>();
            services.AddScoped<IPaymentTermService, PaymentTermService>();
            services.AddScoped<ITaxCalculationService, TaxCalculationService>();
            services.AddScoped<IDailyNotebookService, DailyNotebookService>();
            services.AddScoped<IAssetsFormService, AssetsFormService>();
            services.AddScoped<IBatchService, BatchService>();
            services.AddScoped<ICustomerService, CustomerService>();
            services.AddScoped<IDataImportService, DataImportService>();
            services.AddScoped<ILookupService, LookupService>();
            services.AddScoped<ITenantService, TenantService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IRolesService, RolesService>();
            services.AddScoped<ISubscribersService, SubscribersService>();
            services.AddScoped<IUsersService, UsersService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<ICartService, CartService>();
            services.AddScoped<IPaymentReceiptService, PaymentReceiptService>();

            services.AddScoped<ICreateReportService, CreateReportService>();
            services.AddScoped<IHelper, Helper>();
            services.AddScoped<IBankService, BankService>();
            services.AddScoped<IInventoryReportsService, InventoryReportsService>();
            services.AddScoped<INotificationService, NotificationService>();
            





        }
    }
}
