using MasterErp.Entities.Common.Lookups;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.CodeAnalysis.CodeActions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{

    public class LookupsDbContext : DbContext
    {
        private readonly IConfiguration Configuration;

        public LookupsDbContext(IConfiguration _configuration)
        {
            Configuration = _configuration;
        }

        public LookupsDbContext(DbContextOptions<DbContext> options)
           : base(options)
        {

        }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                string connString = this.Configuration.GetConnectionString("LookupDB");
                optionsBuilder.UseSqlServer(connString);
                optionsBuilder.EnableSensitiveDataLogging();
            }
        }



        public DbSet<JournalType> JournalTypes { get; set; }
        public DbSet<LedgerType> LedgerTypes { get; set; }
        public DbSet<PaymentType> PaymentTypes { get; set; }
        public DbSet<ReceiptType> ReceiptTypes { get; set; }
        public DbSet<TaxLookup> TaxLookups { get; set; }


    }
}

