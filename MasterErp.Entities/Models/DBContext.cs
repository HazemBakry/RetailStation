using Azure.Core;
using MasterErp.Entities.Common.Finance;
using MasterErp.Entities.Models.DataImport;
using MasterErp.Entities.Models.Finance;
using MasterErp.Entities.Models.Global;
using MasterErp.Entities.Models.HR;
using MasterErp.Entities.Models.Inventory;
using MasterErp.Entities.Models.Lookups;
using MasterErp.Entities.Models.Purchases;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class DBContext : DbContext
    {
        //private readonly IConfiguration Configuration;
        private readonly ITenantService _tenantService;
        private readonly string ConnectionString;

        public DBContext(DbContextOptions<DBContext> options, ITenantService tenantService)//, IConfiguration _configuration)
            : base(options)
        {
            //Configuration = _configuration;
            _tenantService = tenantService;
        }

        public DBContext(DbContextOptions<DBContext> options, ITenantService tenantService, IHttpContextAccessor httpContextAccessor)
       : base(options)
        {
            var user = httpContextAccessor.HttpContext?.User;
            if (user == null)
            {
                throw new Exception("SubscriberId is required in the request header.");
            }
            var subscriberId = user.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;

            //var token = httpContextAccessor.HttpContext?.Request.Headers["Authorization"].ToString();
            //var tenantId = "Mishwar"; // httpContextAccessor.HttpContext?.Request.Headers["SubscriberId"].ToString();

            ConnectionString = tenantService.GetConnectionString(subscriberId);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(ConnectionString);
        }


        #region HR

        public DbSet<Employee> Employees { get; set; }
        public DbSet<Attendance> Attendance { get; set; }
        public DbSet<EmployeeVerification> EmployeeVerifications { get; set; }
        public DbSet<EmployeeAttachment> EmployeeAttachments { get; set; }
        public DbSet<Contract> Contracts { get; set; }
        public DbSet<ContractDetail> ContractDetails { get; set; }
        public DbSet<OverTime> OverTime { get; set; }
        public DbSet<Penalty> Penalties { get; set; }
        public DbSet<PenaltyType> PenaltyTypes { get; set; }

        #endregion

        #region Global

        public DbSet<Branch> Branches { get; set; }
        public DbSet<Region> Regions { get; set; }
        public DbSet<OrderStatus> OrderStatus { get; set; }


        #endregion

        public DbSet<Currency> Currency { get; set; }
        public DbSet<Religion> Religions { get; set; }
        public DbSet<SocialStatus> SocialStatus { get; set; }

        public DbSet<ItemLookups> ItemLookups { get; set; }
        public DbSet<Job> Jobs { get; set; }

        public DbSet<Nationality> Nationalities { get; set; }

        public DbSet<FinancialPeriod> FinancialPeriods { get; set; }
        public DbSet<PassportIssuePlace> PassportIssuePlaces { get; set; }
        public DbSet<PurchaseInvoice> PurchaseInvoices { get; set; }
        public DbSet<PurchaseInvoiceDetails> PurchaseInvoiceDetails { get; set; }
        public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
        public DbSet<PurchaseOrderDetails> PurchaseOrderDetails { get; set; }
        public DbSet<PurchaseQuotation> PurchaseQuotations { get; set; }
        public DbSet<PurchaseQuotationDetails> PurchaseQuotationDetails { get; set; }
        public DbSet<SalesInvoice> SalesInvoices { get; set; }
        public DbSet<SalesInvoiceDetails> SalesInvoiceDetails { get; set; }
        public DbSet<Sponsor> Sponsors { get; set; }
        public DbSet<SickLeave> SickLeaves { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<SupplierGroup> SupplierGroups { get; set; }
        public DbSet<Unit> Units { get; set; }
        public DbSet<Vacation> Vacations { get; set; }
        public DbSet<VacationType> VacationTypes { get; set; }
        public DbSet<Deduct> Deducts { get; set; }
        public DbSet<DeductType> DeductTypes { get; set; }
        public DbSet<EmployeeCareer> EmployeeCareers { get; set; }
        public DbSet<WorkStatus> WorkStatus { get; set; }
        public DbSet<LoansPayment> LoansPayment { get; set; }
        public DbSet<Loan> Loans { get; set; }
        public DbSet<LoanType> LoanTypes { get; set; }
        public DbSet<EmployeeAdvance> EmployeeAdvances { get; set; }
        public DbSet<AdvancePayment> AdvancePayments { get; set; }
        public DbSet<AdvanceType> AdvanceTypes { get; set; }
        public DbSet<Store> Stores { get; set; }
        public DbSet<PaymentTerm> PaymentTerms { get; set; }
        public DbSet<PaymentTermDetails> PaymentTermDetails { get; set; }
        public DbSet<TaxCalculation> TaxCalculations { get; set; }
        public DbSet<DailyNotebook> DailyNotebooks { get; set; }
        public DbSet<AssetsForm> AssetsForms { get; set; }
        public DbSet<Loan> LoansForms { get; set; }
        public DbSet<Batch> Batches { get; set; }
        public DbSet<VerifiedAttendanceSummary> VerifiedAttendanceSummary { get; set; }





        #region Inventory

        public DbSet<ItemSupplier> ItemSuppliers { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<ItemCategory> ItemCategories { get; set; }
        public DbSet<MaterialReceipt> MaterialReceipts { get; set; }
        public DbSet<MaterialReceiptDetails> MaterialReceiptDetails { get; set; }
        public DbSet<DeliveryNote> DeliveryNotes { get; set; }
        public DbSet<DeliveryNoteDetails> DeliveryNoteDetails { get; set; }
        public DbSet<MaterialIssue> MaterialIssues { get; set; }
        public DbSet<MaterialIssueDetails> MaterialIssueDetails { get; set; }
        public DbSet<MaterialRequest> MaterialRequests { get; set; }
        public DbSet<MaterialRequestDetails> MaterialRequestDetails { get; set; }


        #endregion

        #region Finance

        public DbSet<AccountTree> AccountTrees { get; set; }
        public DbSet<CostCenterTree> CostCenterTree { get; set; }
        public DbSet<JournalEntry> JournalEntries { get; set; }
        public DbSet<JournalEntryDetail> JournalEntryDetails { get; set; }
        public DbSet<JournalTemplate> JournalTemplates { get; set; }
        public DbSet<JournalTemplateDetails> JournalTemplateDetails { get; set; }
        public DbSet<LedgerJournalType> LedgerJournalTypes { get; set; }

        public DbSet<PaymentOrder> PaymentOrders { get; set; }
        public DbSet<PaymentReceipt> PaymentReceipts { get; set; }
        public DbSet<ReceiveReceipt> ReceiveReceipts { get; set; }
        public DbSet<ReceiptLedger> ReceiptLedgers { get; set; }
        public DbSet<AccountOpeningBalance> AccountOpeningBalance { get; set; }

        #endregion

        #region Purchase

        public DbSet<PurchaseReturns> PurchaseReturns { get; set; }
        public DbSet<PurchaseReturnsDetails> PurchaseReturnsDetails { get; set; }
        public DbSet<PurchaseInvoiceType> PurchaseInvoiceTypes { get; set; }
        public DbSet<PurchaseRequest> PurchaseRequests { get; set; }
        public DbSet<PurchaseRequestDetails> PurchaseRequestDetails { get; set; }
        public DbSet<SupplierReturnsVoucher> SupplierReturnsVouchers { get; set; }
        public DbSet<SupplierReturnsVoucherDetails> SupplierReturnsVoucherDetails { get; set; }

        #endregion

        #region Sales

        public DbSet<Customer> Customers { get; set; }

        #endregion

        #region DataImport
        public DbSet<ImporterModel> Importers { get; set; }
        public DbSet<ImporterColumnModel> ImporterColumns { get; set; }
        #endregion

        #region Lookups
        public DbSet<Country> Countries { get; set; }
        public DbSet<City> Cities { get; set; }

        #endregion

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    if (!optionsBuilder.IsConfigured)
        //    {
        //        string connString = this.Configuration.GetConnectionString("DBConnection");
        //        optionsBuilder.UseSqlServer(connString);
        //        optionsBuilder.EnableSensitiveDataLogging();
        //    }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<ImporterModel>()
                .HasMany(t => t.Columns)
                .WithOne(f => f.Importer)
                .HasForeignKey(f => f.ImporterId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
