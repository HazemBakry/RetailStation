using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class DBContext: DbContext
    {
        private readonly IConfiguration Configuration;

        public DBContext(IConfiguration _configuration)
        {
            Configuration = _configuration;
        }

        public DBContext(DbContextOptions<DbContext> options)
           : base(options)
        {

        }

        public DbSet<AccountTree> AccountTrees { get; set; }
        public DbSet<AccountType> AccountTypes { get; set; }
        public DbSet<Attendance> Attendance { get; set; }
        public DbSet<Branch> Branches { get; set; }
        public DbSet<Bank> Banks { get; set; }
        public DbSet<CostCenterTree> CostCenterTree { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<EmployeeContract> EmployeeContracts { get; set; }
        public DbSet<EmployeeSalary> EmployeeSalaries { get; set; }
        public DbSet<IqamaIssuePlace> IqamaIssuePlaces { get; set; }
        public DbSet<IqamaJob> IqamaJobs { get; set; }
        public DbSet<ItemLookups> ItemLookups { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<JournalEntry> JournalEntries { get; set; }
        public DbSet<JournalEntryDetail> JournalEntryDetails { get; set; }
        public DbSet<JournalEntryType> JournalEntryTypes { get; set; }
        public DbSet<JournalTemplate> JournalTemplate { get; set; }
        public DbSet<JournalTemplateDetails> JournalTemplateDetails { get; set; }
        public DbSet<Nationality> Nationalities { get; set; }
        public DbSet<OverTime> OverTimes { get; set; }
        public DbSet<Penalty> Penalties { get; set; }
        public DbSet<FinancialPeriod> FinancialPeriods { get; set; }
        public DbSet<PassportIssuePlace> PassportIssuePlaces { get; set; }
        public DbSet<PurchaseInvoice> PurchaseInvoices { get; set; }
        public DbSet<PurchaseInvoiceDetails> PurchaseInvoiceDetails { get; set; }
        public DbSet<SalesInvoice> SalesInvoices { get; set; }
        public DbSet<SalesInvoiceDetails> SalesInvoiceDetails { get; set; }
        public DbSet<Sponsor> Sponsors { get; set; }
        public DbSet<SickLeave> SickLeaves { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Units> Units { get; set; }
        public DbSet<Vacation> Vacations { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                string connString = this.Configuration.GetConnectionString("DBConnection");
                optionsBuilder.UseSqlServer(connString);
                optionsBuilder.EnableSensitiveDataLogging();
            }
        }
    }
}
