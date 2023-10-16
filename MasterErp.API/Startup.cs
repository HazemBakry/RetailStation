using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.Finance.GeneralAccounts;
using MasterErp.Interface.Finance.Purchase;
using MasterErp.Interface.Finance.Sales;
using MasterErp.Interface.HR;
using MasterErp.Interface.Inventory;
using MasterErp.Service.Common;
using MasterErp.Service.Finance.GeneralAccounts;
using MasterErp.Service.Finance.Purchase;
using MasterErp.Service.Finance.Sales;
using MasterErp.Service.HR;
using MasterErp.Service.Inventory;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

            services.AddCors(options =>
            {
                options.AddPolicy(MyAllowSpecificOrigins,
                    builder =>
                    {
                        builder.WithOrigins(URLLists).AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin();
                    });
            });

            services.AddControllers();
            services.AddDbContext<DBContext>();
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
            services.AddScoped<ISalesInvoiceService, SalesInvoiceService>();
            services.AddScoped<IJournalEntryService, JournalEntryService>();
            services.AddScoped<IInventoryService, InventoryService>();
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
            app.UseAuthorization();
            app.UseCors(MyAllowSpecificOrigins);
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
