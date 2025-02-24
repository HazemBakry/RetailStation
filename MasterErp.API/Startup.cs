using MasterErp.Entities.DTOs.Auth;
using MasterErp.Entities.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace MasterErp.API
{
    public class Startup
    {
        //private readonly string ConnectionString;
        public IConfiguration Configuration { get; }
        //public ITenantService tenantService { get; set; }

        public Startup(IConfiguration configuration)//, ITenantService tenantService)
        {
            Configuration = configuration;
            //ConnectionString = Configuration.GetConnectionString("DBConnection");
            //this.tenantService = tenantService;
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

            //setup Identity and auth config
            IdentityConfigurations.Configure(services, Configuration);

            services.AddControllers();
            services.AddDbContext<DBContext>();
            //services.AddHttpContextAccessor();


            // Register services using the custom service registration class >> please register your service here 
            Strapping.Bootstrap(services);

            services.AddMvc(options =>
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
