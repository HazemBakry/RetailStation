using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models
{
    public class SubscriptionDbContext : IdentityDbContext<ApplicationUser>
    {
        private readonly IConfiguration Configuration;

        public SubscriptionDbContext(IConfiguration _configuration)
        {
            Configuration = _configuration;
        }

        public SubscriptionDbContext(DbContextOptions<DbContext> options)
           : base(options)
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                string connString = this.Configuration.GetConnectionString("SubscriptionDB");
                optionsBuilder.UseSqlServer(connString);
                optionsBuilder.EnableSensitiveDataLogging();
            }
        }
    }
}
