using MasterErp.Entities.DTOs.Auth;
using MasterErp.Entities.Models;
using MasterErp.Interface.Auth;
using MasterErp.Interface.Common;
using MasterErp.Interface.Finance.GeneralAccounts;
using MasterErp.Interface.Finance.Purchase;
using MasterErp.Interface.Finance.Sales;
using MasterErp.Interface.HR;
using MasterErp.Interface.Inventory;
using MasterErp.Interface.Shared;
using MasterErp.Service.Auth;
using MasterErp.Service.Common;
using MasterErp.Service.Finance.GeneralAccounts;
using MasterErp.Service.Finance.Purchase;
using MasterErp.Service.Finance.Sales;
using MasterErp.Service.HR;
using MasterErp.Service.Inventory;
using MasterErp.Service.Shared;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace MasterErp.API
{
    public class Startup
    {
        private readonly string ConnectionString;
        public IConfiguration Configuration { get; }
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
        }

        readonly string MyAllowSpecificOrigins = "_MasterErp";

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            var URLLists = Configuration.GetSection("URLList").Get<string[]>();
            services.Configure<JWT>(Configuration.GetSection("JWT"));
            services.AddScoped<JWT>(sp => sp.GetRequiredService<IOptions<JWT>>().Value);
            services.AddCors(options =>
            {
                options.AddPolicy(MyAllowSpecificOrigins,
                    builder =>
                    {
                        builder.WithOrigins(URLLists).AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin();
                    });
            });


            services.AddDbContext<SubscriptionDbContext>();

            services.AddIdentity<ApplicationUser, IdentityRole>().AddEntityFrameworkStores<SubscriptionDbContext>();
            services.AddScoped<IAuthService, AuthService>();
            //services.AddDbContext<SubscriptionDbContext>(options =>
            //{
            //    options.UseSqlServer(Configuration.GetConnectionString("SubscriptionDB"));
            //});

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(o =>
            {
                o.RequireHttpsMetadata = false;
                o.SaveToken = false;
                o.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = Configuration["Jwt:Issuer"],
                    ValidAudience = Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
                };
            });



            services.AddControllers();
            services.AddDbContext<DBContext>();
            //services.AddHttpContextAccessor();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddScoped<ISQLHelper, SQLHelper>();
            services.AddScoped<IEmployeesService, EmployeesService>();
            services.AddScoped<IAttendanceService, AttendanceService>();
            services.AddScoped<IOverTimeService, OverTimeService>();
            services.AddScoped<IPenaltyService, PenaltyService>();
            services.AddScoped<ISickLeaveService, SickLeaveService>();
            services.AddScoped<IVacationService, VacationService>();
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

            services
            .AddMvc(options =>
            {
                    options.EnableEndpointRouting = false;
                })
                .AddNewtonsoftJson()
                .SetCompatibilityVersion(CompatibilityVersion.Version_3_0)
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.IgnoreNullValues = true;
                    options.JsonSerializerOptions.WriteIndented = true;
                });


        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseStaticFiles();
            app.UseCors(MyAllowSpecificOrigins);
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
