using RetailStation.Entities.Common.Lookups;
using RetailStation.Entities.Models.HR;
using RetailStation.Entities.Models.Lookups;
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

namespace RetailStation.Entities.Models
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
        public DbSet<Bank> Banks { get; set; }
        public DbSet<EmployeeDueType> EmployeeDueTypes { get; set; }
        public DbSet<IqamaIssuePlace> IqamaIssuePlaces { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<SponsorType> SponsorTypes { get; set; }
        public DbSet<VacationType> VacationTypes { get; set; }
        public DbSet<FinancialCustodyType> FinancialCustodyTypes { get; set; }
        //public DbSet<EmployeeStatus> EmployeeStatus { get; set; }

    }
}

