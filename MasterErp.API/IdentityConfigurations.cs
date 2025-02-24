using MasterErp.Entities.DTOs.Auth;
using MasterErp.Entities.Models;
using MasterErp.Interface.Auth;
using MasterErp.Service.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Configuration;
using System.Text;

namespace MasterErp.API
{
    public static class IdentityConfigurations
    {
        public static void Configure(IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<JWT>(configuration.GetSection("JWT"));
            services.AddScoped<JWT>(sp => sp.GetRequiredService<IOptions<JWT>>().Value);

            services.AddDbContext<SubscriptionDbContext>();
            services.Configure<IdentityOptions>(options =>
            {
                // Set password requirements
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 4;
                options.Password.RequiredUniqueChars = 0;
            });
            services.AddIdentity<ApplicationUser, IdentityRole>().AddEntityFrameworkStores<SubscriptionDbContext>();
            services.AddScoped<IAuthService, AuthService>();

            //services.AddDbContext<DBContext>(options =>
            //{
            //    options.UseSqlServer(tenantService.GetConnectionString("Mishwar"));
            //    //options.UseSqlServer(configuration.GetConnectionString("SubscriptionDB"));
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
                    ValidIssuer = configuration["Jwt:Issuer"],
                    ValidAudience = configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]))
                };
            });
        }
    }
}
