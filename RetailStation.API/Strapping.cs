using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using RetailStation.Entities.Models;
using RetailStation.Interface.Auth;
using RetailStation.Interface.Common;
using RetailStation.Interface.Operation;
using RetailStation.Interface.Roles;
using RetailStation.Interface.Shared;
using RetailStation.Interface.SupplierManagement;
using RetailStation.Interface.SystemAdmin;
using RetailStation.Interface.SystemSetting;
using RetailStation.Interface.Users;
using RetailStation.Interface.Website;
using RetailStation.Interfaces.Subscription;
using RetailStation.Service.Auth;
using RetailStation.Service.Common;
using RetailStation.Service.Inventory;
using RetailStation.Service.Operation;
using RetailStation.Service.Roles;
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
            services.AddScoped<ISharedService, SharedService>();
            services.AddScoped<IItemsService, ItemsService>();
            services.AddScoped<ISharedFilterService, SharedFilterService>();
            services.AddScoped<IExportService, ExportService>();
            services.AddScoped<IMerchantsService, MerchantsService>();
            services.AddScoped<ISystemSettingService, SystemSettingService>();
            services.AddScoped<ISuppliersService, SuppliersService>();
            services.AddScoped<ISupplierManagementService, SupplierManagementService>();
            services.AddScoped<IMerchantManagementService, MerchantManagementService>();
            services.AddScoped<IWebsiteService, WebsiteService>();
            services.AddScoped<IDataImportService, DataImportService>();
            services.AddScoped<ILookupService, LookupService>();
            services.AddScoped<ITenantService, TenantService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IRolesService, RolesService>();
            services.AddScoped<ISubscribersService, SubscribersService>();
            services.AddScoped<IUsersService, UsersService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<ICartService, CartService>();
            services.AddScoped<ICreateReportService, CreateReportService>();
            services.AddScoped<IHelper, Helper>();
            services.AddScoped<INotificationService, NotificationService>();
            





        }
    }
}
