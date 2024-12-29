using MasterErp.Entities.Models.HR;
using MasterErp.Entities.Models.HR.Employee;
using MasterErp.Entities.Models.Inventory;
using MasterErp.Entities.Models.Lookups;
using MasterErp.Entities.Models.Purchases;
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
        public DbSet<ActionType> ActionTypes { get; set; }
        public DbSet<Attendance> Attendance { get; set; }
        public DbSet<Branch> Branches { get; set; }
        public DbSet<Bank> Banks { get; set; }
        public DbSet<CostCenterTree> CostCenterTree { get; set; }
        public DbSet<Currency> Currency { get; set; }
        public DbSet<Religion> Religions { get; set; }
        public DbSet<SocialStatus> SocialStatus { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<EmployeeVerification> EmployeeVerifications { get; set; }
        public DbSet<EmployeeAttachment> EmployeeAttachments { get; set; }
        public DbSet<EmployeeSalary> EmployeeSalaries { get; set; }
        public DbSet<EmployeeContract> EmployeeContracts { get; set; }
        public DbSet<IqamaIssuePlace> IqamaIssuePlaces { get; set; }
        public DbSet<IqamaJob> IqamaJobs { get; set; }
        public DbSet<ItemLookups> ItemLookups { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<JournalEntry> JournalEntries { get; set; }
        public DbSet<JournalEntryDetail> JournalEntryDetails { get; set; }
        public DbSet<JournalEntryType> JournalEntryTypes { get; set; }
        public DbSet<JournalTemplate> JournalTemplate { get; set; }
        public DbSet<JournalTemplateDetails> JournalTemplateDetails { get; set; }
        public DbSet<Nationality> Nationalities { get; set; }
        public DbSet<OverTime> OverTime { get; set; }
        public DbSet<Penalty> Penalties { get; set; }
        public DbSet<PenaltyType> PenaltyTypes { get; set; }
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
        public DbSet<Store> Stores { get; set; }
        public DbSet<PaymentTerm> PaymentTerms { get; set; }
        public DbSet<PaymentTermDetail> PaymentTermDetails { get; set; }
        public DbSet<TaxCalculation> TaxCalculations { get; set; }
        public DbSet<TaxLookup> TaxLookups { get; set; }
        public DbSet<DailyNotebook> DailyNotebooks { get; set; }
        public DbSet<AssetsForm> AssetsForms { get; set; }
        public DbSet<Loans> LoansForms { get; set; }





        //Elassal


        public DbSet<ItemSupplier> ItemSuppliers { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<ItemCategory> ItemCategories { get; set; }
        public DbSet<PurchaseReturns> PurchaseReturns { get; set; }
        public DbSet<PurchaseReturnsDetails> PurchaseReturnsDetails { get; set; }
        public DbSet<PurchaseInvoiceType> PurchaseInvoiceTypes { get; set; }
        public DbSet<ReceiveOrder> ReceiveOrders { get; set; }
        public DbSet<ReceiveOrderDetails> ReceiveOrderDetails { get; set; }

        public DbSet<DeliveryOrder> DeliveryOrders { get; set; }
        public DbSet<DeliveryOrderDetails> DeliveryOrderDetails { get; set; }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<PaymentReceipt> PaymentReceipt { get; set; }
        public DbSet<ReceiveReceipt> ReceiveReceipt { get; set; }
        public DbSet<ReceiptLedger> ReceiptLedger { get; set; }
        public DbSet<ReceitLedgerType> ReceitLedgerType { get; set; }


        public DbSet<PurchaseRequest> PurchaseRequests { get; set; }
        public DbSet<PurchaseRequestDetails> PurchaseRequestDetails { get; set; }
        public DbSet<SupplierReturnsVoucher> SupplierReturnsVouchers { get; set; }
        public DbSet<SupplierReturnsVoucherDetails> SupplierReturnsVoucherDetails { get; set; }
        public DbSet<AccountOpeningBalance> AccountOpeningBalance { get; set; }



        #region Lookups
        public DbSet<Country> Countries { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Region> Regions { get; set; }

        #endregion
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
